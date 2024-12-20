import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {/* Home Button */}
        <NavLink to="/admin-home" className="sidebar-option">
          <img src={assets.home_icon} alt="Home" />
          <p>Home</p>
        </NavLink>
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="Add Items" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="List Items" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
