const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db_access = require('./database.js');
const db = db_access.db;

const server = express();
const port = 555;

server.use(cors());
server.use(express.json());

// User Login Route
server.post('/user/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    db.get(`SELECT * FROM USER WHERE EMAIL=?`, [email], (err, row) => {
        if (err) {
            return res.status(500).send('Error accessing the database');
        }
        if (!row) {
            return res.status(401).send('User not found');
        }

        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Error comparing password');
            }
            if (!isMatch) {
                return res.status(401).send('Invalid credentials');
            }

            res.cookie('username', row.NAME, {
                httpOnly: true,
                maxAge: 36000000, // 10 hours
            });
            return res.status(200).send('Login successful');
        });
    });
});

// User Registration Route
server.post('/user/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Error hashing password');
        }

        db.run(
            `INSERT INTO USER (name, email, password) VALUES (?, ?, ?)`,
            [name, email, hashedPassword],
            (err) => {
                if (err) {
                    console.log(err.message);
                    return res.status(400).send('Error registering user');
                } else {
                    return res.status(200).send('Registration successful');
                }
            }
        );
    });
});

// Add Product Route
server.post('/products/add', (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = parseInt(req.body.quantity, 10);
    const category = req.body.category; // category like 'Jersey', 'Shorts'

    const query = `INSERT INTO PRODUCTS (name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [name, description, price, quantity, category], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error adding product');
        } else {
            return res.status(200).send('Product added successfully');
        }
    });
});

// View Products Route
server.get('/products', (req, res) => {
    const query = `SELECT * FROM PRODUCTS`;

    db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching products');
        } else {
            return res.json(rows);
        }
    });
});

// Search Products by Category
server.get('/products/search', (req, res) => {
    const category = req.query.category;
    const query = `SELECT * FROM PRODUCTS WHERE category = ?`;

    db.all(query, [category], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error searching products');
        } else {
            return res.json(rows);
        }
    });
});

// Add Product to Cart (Shopping Cart)
server.post('/cart/add', (req, res) => {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    const query = `INSERT INTO CART (user_id, product_id, quantity) VALUES (?, ?, ?)`;

    db.run(query, [userId, productId, quantity], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error adding product to cart');
        } else {
            return res.status(200).send('Product added to cart');
        }
    });
});

// View Cart Items
server.get('/cart/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `SELECT * FROM CART WHERE user_id = ?`;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching cart items');
        } else {
            return res.json(rows);
        }
    });
});

// Checkout (Place Order)
server.post('/order/checkout', (req, res) => {
    const userId = req.body.userId;
    const totalAmount = req.body.totalAmount; // Total amount from cart
    const orderDate = new Date().toISOString();

    // Create Order
    const query = `INSERT INTO ORDERS (user_id, total_amount, order_date) VALUES (?, ?, ?)`;

    db.run(query, [userId, totalAmount, orderDate], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error placing order');
        }

        // Add items to the OrderDetails table
        const orderId = this.lastID;
        const cartQuery = `SELECT * FROM CART WHERE user_id = ?`;

        db.all(cartQuery, [userId], (err, cartItems) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error fetching cart items');
            }

            cartItems.forEach(item => {
                const orderDetailsQuery = `INSERT INTO ORDER_DETAILS (order_id, product_id, quantity) VALUES (?, ?, ?)`;

                db.run(orderDetailsQuery, [orderId, item.product_id, item.quantity], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Error adding items to order');
                    }

                    // Update product quantity in stock
                    const updateQuantityQuery = `UPDATE PRODUCTS SET quantity = quantity - ? WHERE id = ?`;

                    db.run(updateQuantityQuery, [item.quantity, item.product_id], (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            });

            // Empty the cart after checkout
            const deleteCartQuery = `DELETE FROM CART WHERE user_id = ?`;
            db.run(deleteCartQuery, [userId], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error clearing cart');
                }

                return res.status(200).send('Order placed successfully');
            });
        });
    });
});

server.listen(port, () => {
    console.log(`Server started at port ${port}`);
    db.serialize(() => {
        // Create necessary tables for users, products, orders, and cart
        db.run(db_access.createUserTable, (err) => {
            if (err) {
                console.log('Error creating user table: ' + err);
            }
        });

        db.run(db_access.createProductTable, (err) => {
            if (err) {
                console.log('Error creating product table: ' + err);
            }
        });

        db.run(db_access.createOrderTable, (err) => {
            if (err) {
                console.log('Error creating order table: ' + err);
            }
        });

        db.run(db_access.createCartTable, (err) => {
            if (err) {
                console.log('Error creating cart table: ' + err);
            }
        });

        db.run(db_access.createOrderDetailsTable, (err) => {
            if (err) {
                console.log('Error creating order details table: ' + err);
            }
        });
    });
});
