import React, { useState } from 'react';
import './checkout.css'; 

const Checkout = ({ cartItems, calculateTotal, navigateTo, username }) => {
  const [isFormVisible, setIsFormVisible] = useState(false); // State for toggling form visibility
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [successMessage, setSuccessMessage] = useState(''); // For showing the success/error message

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      userName: formData.name || username, 
      phone: formData.phone,
      address: formData.address,
      cartItems: cartItems,
      totalAmount: calculateTotal(),
    };

    try {
      const response = await fetch('http://localhost:555/order/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Order submitted successfully', result);
        setSuccessMessage('Your order has been placed successfully!');
        setTimeout(() => navigateTo('order-confirmation'), 3000);
      } else {
        console.error('Backend Error:', result);
        setSuccessMessage(result.error || 'Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setSuccessMessage('An error occurred. Please try again.');
    }
  };

  // Toggle form visibility when "Complete Purchase" is clicked
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Checkout</h2>
        <p>Review and complete your purchase.</p>
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
                <th>Quantity</th>
                <th>Total</th>
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
                  <td>{item.quantity}</td>
                  <td>${item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="checkout-summary">
          <p><strong>Total: ${calculateTotal()}</strong></p>
        </div>
      </div>

      <div className="checkout-buttons">
        <button className="proceed-btn" onClick={() => navigateTo('products')}>Go to Products</button>
        <button className="complete-btn" onClick={toggleFormVisibility}>Complete Purchase</button>
      </div>

      {isFormVisible && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Address:
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {/* Success/Error Message */}
      {successMessage && <p className="message">{successMessage}</p>}

      <footer>
        <p>&copy; 2024 Football Clothing Store. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Checkout;
