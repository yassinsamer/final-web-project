import React, { useState } from 'react';
import SignUp from './signup';
import LoginPage from './loginpage';
import HomePage from './homepage';
import ProductsPage from './productspage';
import Checkout from './checkout'; 
import Cart from './cart'; 
import AboutUs from './aboutus'; 

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [username, setUsername] = useState('');
  const [cart, setCart] = useState([]); // Initialize cart as an empty array

  // Handle navigation between pages
  const navigateTo = (page) => {
    setCurrentPage(page); // Set the current page to the desired one
  };

  // Handle login
  const handleLogin = (username) => {
    setUsername(username);
    navigateTo('home'); 
  };

  
  const addToCart = (product) => {
    // Check if the product already exists in the cart
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1; // Increase quantity if product already in cart
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }]; // Add product to cart
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId)); // Remove item by ID
  };

  // Function to calculate the total price of items in the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Render the correct page based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} username={username} />;
      case 'products':
        return <ProductsPage navigateTo={navigateTo} addToCart={addToCart} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'signup':
        return <SignUp navigateTo={navigateTo} />;
      case 'cart':
        return <Cart navigateTo={navigateTo} cartItems={cart} removeFromCart={removeFromCart} />;
      case 'checkout':
        return <Checkout navigateTo={navigateTo} cartItems={cart} calculateTotal={calculateTotal} username={username} />;
      case 'aboutus': 
        return <AboutUs navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return <div>{renderPage()}</div>;
};

export default App;
