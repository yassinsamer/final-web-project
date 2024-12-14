const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ecommerce.db');

// Create USER Table for storing user information
db.run(`CREATE TABLE IF NOT EXISTS USER (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT NOT NULL,
    EMAIL TEXT UNIQUE NOT NULL,
    PASSWORD TEXT NOT NULL,
    ISADMIN INTEGER DEFAULT 0
)`);

// Create PRODUCTS Table for storing product information
db.run(`CREATE TABLE IF NOT EXISTS PRODUCTS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT NOT NULL,
    CATEGORY TEXT NOT NULL,
    PRICE REAL NOT NULL,
    DESCRIPTION TEXT,
    QUANTITY INTEGER NOT NULL,
    IMAGE_URL TEXT,
    BRAND TEXT DEFAULT 'Unknown'
)`);

// Create PRODUCT_SIZES Table for storing sizes of products
db.run(`CREATE TABLE IF NOT EXISTS PRODUCT_SIZES (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    PRODUCT_ID INTEGER,
    SIZE TEXT NOT NULL,
    QUANTITY INTEGER NOT NULL,
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS (ID)
)`);

// Create ORDERS Table for storing orders
db.run(`CREATE TABLE IF NOT EXISTS ORDERS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID INTEGER,
    USER_NAME TEXT NOT NULL,
    PHONE TEXT NOT NULL,
    ADDRESS TEXT NOT NULL,
    TOTAL_AMOUNT REAL NOT NULL,
    ORDER_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (USER_ID) REFERENCES USER (ID)
)`);

// Create ORDER_ITEMS Table for storing items in each order
db.run(`CREATE TABLE IF NOT EXISTS ORDER_ITEMS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    ORDER_ID INTEGER,
    PRODUCT_ID INTEGER,
    QUANTITY INTEGER NOT NULL,
    PRICE REAL NOT NULL,
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS (ID),
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS (ID)
)`);

// Function to initialize the database if needed
const initializeDatabase = () => {
    db.serialize(() => {
        // Create tables if they don't exist already
        db.run(`CREATE TABLE IF NOT EXISTS USER (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME TEXT NOT NULL,
            EMAIL TEXT UNIQUE NOT NULL,
            PASSWORD TEXT NOT NULL,
            ISADMIN INTEGER DEFAULT 0
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS PRODUCTS (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME TEXT NOT NULL,
            CATEGORY TEXT NOT NULL,
            PRICE REAL NOT NULL,
            DESCRIPTION TEXT,
            QUANTITY INTEGER NOT NULL,
            IMAGE_URL TEXT,
            BRAND TEXT DEFAULT 'Unknown'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS PRODUCT_SIZES (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            PRODUCT_ID INTEGER,
            SIZE TEXT NOT NULL,
            QUANTITY INTEGER NOT NULL,
            FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS (ID)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS ORDERS (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            USER_ID INTEGER,
            USER_NAME TEXT NOT NULL,
            PHONE TEXT NOT NULL,
            ADDRESS TEXT NOT NULL,
            TOTAL_AMOUNT REAL NOT NULL,
            ORDER_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (USER_ID) REFERENCES USER (ID)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS ORDER_ITEMS (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            ORDER_ID INTEGER,
            PRODUCT_ID INTEGER,
            QUANTITY INTEGER NOT NULL,
            PRICE REAL NOT NULL,
            FOREIGN KEY (ORDER_ID) REFERENCES ORDERS (ID),
            FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS (ID)
        )`);
    });
};

// Function to insert a user
const insertUser = (name, email, password, isAdmin = 0, callback) => {
    db.run(
        `INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, ?)`,
        [name, email, password, isAdmin],
        function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.lastID); // Return the user ID
        }
    );
};

// Function to insert a product
const insertProduct = (name, category, price, description, quantity, imageUrl, brand, sizes, callback) => {
    db.run(
        `INSERT INTO PRODUCTS (NAME, CATEGORY, PRICE, DESCRIPTION, QUANTITY, IMAGE_URL, BRAND) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, category, price, description, quantity, imageUrl, brand],
        function (err) {
            if (err) {
                return callback(err);
            }

            const productId = this.lastID; // Get the inserted product's ID

            // Insert product sizes
            sizes.forEach(size => {
                db.run(
                    `INSERT INTO PRODUCT_SIZES (PRODUCT_ID, SIZE, QUANTITY) VALUES (?, ?, ?)`,
                    [productId, size.size, size.quantity],
                    (err) => {
                        if (err) {
                            console.log('Error inserting product size:', err);
                        }
                    }
                );
            });

            callback(null, productId);
        }
    );
};

// Function to submit an order
const submitOrder = (userName, phone, address, cartItems, totalAmount, callback) => {
    // Insert the order into the ORDERS table
    db.run(
        `INSERT INTO ORDERS (USER_NAME, PHONE, ADDRESS, TOTAL_AMOUNT) VALUES (?, ?, ?, ?)`,
        [userName, phone, address, totalAmount],
        function (err) {
            if (err) {
                return callback(err);
            }

            const orderId = this.lastID; // Get the inserted order's ID

            // Insert order items into ORDER_ITEMS table
            cartItems.forEach(item => {
                db.run(
                    `INSERT INTO ORDER_ITEMS (ORDER_ID, PRODUCT_ID, QUANTITY, PRICE) VALUES (?, ?, ?, ?)`,
                    [orderId, item.id, item.quantity, item.price],
                    (err) => {
                        if (err) {
                            console.log('Error inserting order item:', err);
                        }
                    }
                );
            });

            callback(null, orderId); // Return the order ID
        }
    );
};

// Export the database and functions for use
module.exports = { db, initializeDatabase, insertUser, insertProduct, submitOrder };
