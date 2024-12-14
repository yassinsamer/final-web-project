const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db_access = require('./database.js');
const db = db_access.db;
const products = require('./products.js');
const server = express();
const port = 555;

// Middleware setup
server.use(cors());
server.use(express.json());

// User Login Route
server.post('/user/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM USER WHERE EMAIL=?`, [email], (err, row) => {
        if (err) {
            console.log('Error retrieving user data:', err);
            return res.status(500).json({ error: 'Error retrieving user data.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) {
                console.log('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error comparing passwords.' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Send response after successful login
            res.cookie('username', row.NAME, {
                httpOnly: true,
                maxAge: 36000000, // 10 hours
            });
            return res.status(200).json({ message: 'Login successful' });
        });
    });
});

// User Registration Route
server.post('/user/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check if email already exists
    db.get(`SELECT * FROM USER WHERE EMAIL = ?`, [email], (err, row) => {
        if (err) {
            console.log('Error checking email in database:', err);
            return res.status(500).json({ error: 'Error checking email.' });
        }
        if (row) {
            console.log(`Email already in use: ${email}`);
            return res.status(400).json({ error: 'Email already in use.' });
        }

        // Hash the password before saving
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.log('Error hashing password:', err);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Insert the user into the database
            db.run(
                `INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, ?)`,
                [name, email, hashedPassword, 0],  // `0` represents a non-admin user
                (err) => {
                    if (err) {
                        console.log('Error inserting user into DB:', err.message);
                        return res.status(500).json({ error: 'Error registering user' });
                    }
                    console.log(`User registered: ${name}`);
                    return res.status(200).json({ message: 'Registration successful' });
                }
            );
        });
    });
});

// Insert products into the database
server.post('/products/insert', (req, res) => {
    console.log('Starting to insert products...');

    let errorOccurred = false; // Flag to track if an error occurs
    let completedInserts = 0;
    let totalInserts = products.length;

    // Insert each product
    products.forEach(product => {
        const { name, category, price, quantity, sizes, image_url, brand = 'Unknown' } = product; // Default brand if not provided

        // Insert the product into the PRODUCTS table
        db.run(
            `INSERT INTO PRODUCTS (NAME, CATEGORY, PRICE, DESCRIPTION, QUANTITY, IMAGE_URL, BRAND) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, category, price, 'No description available', quantity, image_url, brand],
            function (err) {
                if (err) {
                    console.log('Error inserting product:', err);
                    errorOccurred = true; // Set the flag if an error occurs
                    return res.status(500).json({ error: 'Error inserting product into database.' });
                }

                const productId = this.lastID; // Get the ID of the inserted product
                console.log(`Product inserted: ${name} (ID: ${productId})`);

                // Insert sizes for the product
                sizes.forEach(size => {
                    db.run(
                        `INSERT INTO PRODUCT_SIZES (PRODUCT_ID, SIZE, QUANTITY) VALUES (?, ?, ?)`,
                        [productId, size.size, size.quantity],
                        (err) => {
                            if (err) {
                                console.log('Error inserting product size:', err);
                            } else {
                                console.log(`Size inserted: ${size.size} for product ${name}`);
                            }
                        }
                    );
                });

                // Increment the completed inserts count
                completedInserts++;

                // If all products have been inserted, send the response
                if (completedInserts === totalInserts && !errorOccurred) {
                    return res.status(200).json({ message: 'Products inserted successfully.' });
                }
            }
        );
    });
});

// API route to submit an order
server.post('/order/submit', (req, res) => {
    const { userName, phone, address, cartItems, totalAmount } = req.body;

    // Validate required fields
    if (!userName || !phone || !address || !Array.isArray(cartItems) || cartItems.length === 0 || !totalAmount) {
        console.log('Validation error: Missing or invalid fields.');
        return res.status(400).json({ error: 'Missing or invalid required fields. Please ensure all details are correct.' });
    }

    console.log('Order Details:', { userName, phone, address, totalAmount });
    console.log('Cart Items:', cartItems);

    // Insert the order into the ORDERS table
    const orderQuery = `INSERT INTO ORDERS (USER_NAME, PHONE, ADDRESS, TOTAL_AMOUNT) VALUES (?, ?, ?, ?)`;

    db.run(orderQuery, [userName, phone, address, totalAmount], function (err) {
        if (err) {
            console.log('Error inserting order:', err.message); // Log the error for debugging
            return res.status(500).json({ error: 'Error placing order. Please try again later.' });
        }

        const orderId = this.lastID; // Get the ID of the inserted order
        console.log(`Order inserted with ID: ${orderId}`);

        // Insert the order items into the ORDER_ITEMS table
        const orderItemsQuery = `INSERT INTO ORDER_ITEMS (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;

        let errorOccurred = false; // Track if any error occurs during item insertion
        let completedInserts = 0; // Track the number of successfully inserted items

        cartItems.forEach((item, index) => {
            db.run(orderItemsQuery, [orderId, item.id, item.quantity, item.price], (err) => {
                if (err) {
                    console.log(`Error inserting order item for product ID ${item.id}:`, err.message); // Log detailed error
                    errorOccurred = true;
                }

                completedInserts++;

                // Send response after processing all items
                if (completedInserts === cartItems.length) {
                    if (errorOccurred) {
                        console.log('Some items failed to insert.');
                        return res.status(500).json({ error: 'Order was partially processed. Please contact support.' });
                    }

                    console.log('All order items inserted successfully.');
                    return res.status(200).json({ message: 'Order placed successfully!' });
                }
            });
        });
    });
});

// Server Initialization
server.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
