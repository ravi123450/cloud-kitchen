import React from 'react';
import './WhyNuvola.css';
import { assets } from '../../assets/assets'; // Update this with correct asset paths

const WhyNuvola = () => {
  return (
    <div className="why-nuvola-container">
      <h2 className="why-nuvola-title">Why Nuvola?</h2>
      <div className="why-nuvola-cards">
        <div className="nuvola-card">
          <img src={assets.nut} alt="Nutritionist Icon" />
          <h3>By Nutritionists</h3>
          <p>All meals are designed by our nutrition experts using only the finest quality ingredients.</p>
        </div>
        <div className="nuvola-card">
          <img src={assets.del} alt="Delivery Icon" />
          <h3>Free Delivery</h3>
          <p>Delivered to your home, office, or gym, wherever you wish to enjoy nutritious meals.</p>
        </div>
        <div className="nuvola-card">
          <img src={assets.fresh} alt="Fresh Ingredients Icon" />
          <h3>Fresh Ingredients</h3>
          <p>We procure fresh, high-quality ingredients to deliver wholesome meals every day.</p>
        </div>
        <div className="nuvola-card">
          <img src={assets.pres} alt="No Preservatives Icon" />
          <h3>No Preservatives</h3>
          <p>Your ultimate plan for clean eating without added preservatives or artificial additives.</p>
        </div>
      </div>
    </div>
  );
};

export default WhyNuvola;
