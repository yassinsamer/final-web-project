# Football Clothing Store

## Overview
The **Football Clothing Store** is a full-stack e-commerce web application designed for football enthusiasts. It provides a seamless shopping experience, allowing users to browse football gear, manage their shopping carts, and complete orders through an intuitive and secure platform.

---

## Features
- **User Authentication**: Signup and login functionality for users.
- **Product Browsing**: A catalog of football apparel and accessories.
- **Shopping Cart**: Add, update, and remove items.
- **Checkout Process**: Collect user details and process orders.
- **Dynamic Navigation**: Smooth transitions between pages.
- **Responsive Design**: Optimized for various devices.

---

## Technologies Used
### Frontend:
- **React.js**: For building dynamic user interfaces.
- **CSS**: For styling the application.

### Backend:
- **Node.js**: For server-side logic.
- **Express.js**: For creating RESTful APIs.
- **SQLite**: As the database for managing application data.

---

## Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:
   ```bash
   cd football-clothing-store
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up the database**:
   - Place the `ecommerce.db` file in the root directory.
   - The database schema will be created automatically when the server starts.

5. **Start the server**:
   ```bash
   node server.js
   ```

6. **Start the frontend**:
   ```bash
   npm start
   ```
   The application will be accessible at `http://localhost:3000`.

---

## Usage
1. **Sign Up**:
   - Create an account on the signup page.
2. **Log In**:
   - Use your credentials to access the platform.
3. **Browse Products**:
   - Explore football gear on the products page.
4. **Add to Cart**:
   - Add items to your shopping cart.
5. **View Cart**:
   - Review items and adjust quantities.
6. **Checkout**:
   - Complete the checkout process and place your order.

---

## Project Structure
```
root/
├── backend/
│   ├── server.js          # Backend server
│   ├── database.js        # Database schema and queries
│   ├── products.js        # Predefined product data
├── frontend/
│   ├── App.js             # Main React component
│   ├── signup.js          # Signup page
│   ├── loginpage.js       # Login page
│   ├── homepage.js        # Homepage
│   ├── productspage.js    # Products page
│   ├── cart.js            # Shopping cart
│   ├── checkout.js        # Checkout page
│   ├── aboutus.js         # About Us page
│   ├── styles/            # CSS files
├── ecommerce.db           # SQLite database
├── package.json           # Dependencies and scripts
```

---

## Future Enhancements
- **Payment Integration**: Add payment gateways for secure transactions.
- **Search Functionality**: Enable search and filtering for easier product discovery.
- **User Dashboard**: Allow users to view order history and manage their profiles.
- **Admin Panel**: Provide tools for managing products and orders.
- **Token-Based Authentication**: Improve security with JWT for session management.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
