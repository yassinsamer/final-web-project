import React from 'react';
import './cart.css';

const Cart = ({ cartItems, removeFromCart, navigateTo }) => {
  // Function to calculate the total price of items in the cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Handle updating the quantity of items
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 5) {
      const updatedCartItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      
    }
  };

  // Handle Proceed to Checkout
  const handleProceedToCheckout = () => {
    navigateTo('checkout'); 
  };

  return (
    <div className="cart-container">
      <nav>
        <button onClick={() => navigateTo('home')}>Home</button>
        <button onClick={() => navigateTo('products')}>Products</button>
        <button onClick={() => navigateTo('aboutus')}>About Us</button>
        <button onClick={() => navigateTo('cart')}>Cart</button>
      </nav>

      <div className="cart-header">
        <h2>Your Shopping Cart</h2>
        <p>Review your items before proceeding to checkout.</p>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <select value={item.size} onChange={(e) => {}}>
                      <option value="S">Small</option>
                      <option value="M">Medium</option>
                      <option value="L">Large</option>
                      <option value="XL">X-Large</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      max="5"
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="cart-summary">
          <p><strong>Total: ${calculateTotal()}</strong></p>
          <button className="checkout-btn" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
        </div>
      </div>

      <footer>
        <p>&copy; 2024 Football Clothing Store. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
