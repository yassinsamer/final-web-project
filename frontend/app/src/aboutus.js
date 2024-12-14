import React from 'react';
import './aboutus.css'; 

const AboutUs = ({ navigateTo }) => {
  return (
    <div>
     
      <nav>
        <button onClick={() => navigateTo('home')}>Home</button>
        <button onClick={() => navigateTo('products')}>Products</button>
        <button onClick={() => navigateTo('aboutus')}>About Us</button>
        <button onClick={() => navigateTo('cart')}>Cart</button>
      </nav>

      
      <div className="about-header">
        <h2>About Football Clothing Store</h2>
        <p>Your one-stop shop for football apparel and accessories!</p>
      </div>

      <div className="about-content">
        <h3>Our Mission</h3>
        <p>
          We aim to provide top-quality football gear that helps athletes perform at their best.
          Our products are carefully selected for their comfort, durability, and style, ensuring that you’re always ready for your next match.
        </p>

        <h3>Our Team</h3>
        <p>
          Our team consists of passionate football enthusiasts who work tirelessly to bring the latest trends in football fashion to you.
          We’re committed to offering superior customer service and only the highest-quality products.
        </p>
      </div>

      
      <footer>
        <p>&copy; 2024 Football Clothing Store. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default AboutUs;
