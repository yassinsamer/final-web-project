import React from 'react';
import './products.css'; 

const ProductsPage = ({ navigateTo, addToCart }) => {
  const products = [
    {
      id: 1,
      name: 'Liverpool FC',
      price: 60,
      image: 'https://cdn.media.amplience.net/i/frasersdev/37848408_o.jpg?v=240429125331',
      description: 'Comfortable and stylish jerseys for your game.',
    },
    {
      id: 2,
      name: 'Al Ahly',
      price: 150,
      image: 'https://assets.adidas.com/images/w_1880,f_auto,q_auto/038692973e594495a5966d3ba81af3b7_9366/JK2250_21_model.jpg',
      description: 'Perfect fit and durability for your matches.',
    },
    {
      id: 3,
      name: 'Ghazl Elmahala',
      price: 23,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz20Ngkzkt_IXtRMFymrX_kulG1nLzzBKNQ&s',
      description: 'Perfect fit and durability for your matches.',
    },
    {
      id: 4,
      name: 'Inter Miami',
      price: 80,
      image: 'https://kickkit.co.za/cdn/shop/files/Inter_Miami_CF_24-25_Messi_Home_Jersey_Pink_JE9741_01_laydown.jpg?v=1722931957',
      description: 'Perfect fit and durability for your matches.',
    },
    {
      id: 5,
      name: 'Boca Juniors',
      price: 40,
      image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/cbc6793f0b9143cfac29ad720104e9bb_9366/Boca_Juniors_21-22_Home_Jersey_Blue_HD9685_01_laydown.jpg',
      description: 'Perfect fit and durability for your matches.',
    },
    {
      id: 6,
      name: 'Football Shorts (black)',
      price: 10,
      image: 'https://dsrcv.com/cdn/shop/files/sport-short-black-destructive-977865_grande.jpg?v=1724397573',
      description: 'Perfect for a high-performance match, now in black.',
    },
    {
      id: 7,
      name: 'Football Shorts (white)',
      price: 10,
      image: 'https://media.alshaya.com/adobe/assets/urn:aaid:aem:6f1470da-1be2-4f67-bfb8-4a5062102d74/original/as/EID-d87f43287e75c80f9d88cdf0d8c77e178682e5c1.jpg?preferwebp=true',
      description: 'Perfect for a high-performance match, now in white.',
    },
    {
      id: 8,
      name: 'Football Shorts (red)',
      price: 10,
      image: 'https://image.hm.com/assets/hm/33/6e/336e0455eaf642ba0a0bdcfb877cfc2e1b3fcda8.jpg?imwidth=2160',
      description: 'Perfect for a high-performance match, now in red.',
    },
  ];

  // Handle adding a product to the cart
  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1, 
    });
  };

  return (
    <div>
     
      <nav>
        <button onClick={() => navigateTo('home')}>Home</button>
        <button onClick={() => navigateTo('products')}>Products</button>
        <button onClick={() => navigateTo('aboutus')}>About Us</button>
        <button onClick={() => navigateTo('cart')}>Cart</button>
      </nav>

      {/* Products Section */}
      <div className="products-header">
        <h2>Our Football Gear Collection</h2>
        <p>Check out our range of top-quality football apparel and accessories!</p>
      </div>

      {/* Product List */}
      <div className="product-list">
        {products.map((product) => (
          <div className="product" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      
      <footer>
        <p>&copy; 2024 Football Clothing Store. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ProductsPage;
