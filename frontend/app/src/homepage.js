import React from 'react';
import './homepage.css'; 

const HomePage = ({ navigateTo, username, onLogout }) => { 
  return (
    <div>
     
      <nav>
        <button onClick={() => navigateTo('home')}>Home</button>
        <button onClick={() => navigateTo('products')}>Products</button>
        <button onClick={() => navigateTo('aboutus')}>About Us</button>
        <button onClick={() => navigateTo('cart')}>Cart</button>
       
      </nav>

      
      <div className="welcome">
        <h1>Welcome to the Football Clothing Store!</h1>
        <p>Shop the latest football gear and apparel!</p>
      </div>

      
      <div className="products">
        {/* Product 1 */}
        <div className="product">
          <img src="https://www.hitprintasia.com/cdn/shop/products/p1910_11.png?v=1570085703" alt="Football Jersey" />
          <h3>Football Jersey</h3>
          <p>Comfortable and stylish jerseys for your game.</p>
          <button onClick={() => navigateTo('products')}>Shop Now</button> {/* Redirects to the products page */}
        </div>

        {/* Product 2 */}
        <div className="product">
          <img src="https://dsrcv.com/cdn/shop/files/sport-short-black-destructive-977865_grande.jpg?v=1724397573" alt="Football Shorts" />
          <h3>Football Shorts</h3>
          <p>Perfect fit and durability for your matches.</p>
          <button onClick={() => navigateTo('products')}>Shop Now</button> {/* Redirects to the products page */}
        </div>
      </div>

      
      <footer>
        <p>&copy; 2024 Football Clothing Store. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
