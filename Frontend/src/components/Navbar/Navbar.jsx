import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

    const navigate = useNavigate();

    // Optional safeguard for cart total calculation
    let totalAmount = 0;
    try {
        totalAmount = getTotalCartAmount ? getTotalCartAmount() : 0;
    } catch (err) {
        console.error("Error calculating total cart amount:", err);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    return (
        <div className="navbar">
            <Link to="/">
                <img src={assets.logo} alt="Logo" className="logo" />
            </Link>
            <ul className="navbar-menu">
                <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
                <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
                <Link to="/diet-plan" onClick={() => setMenu("diet-plan")} className={menu === "diet-plan" ? "active" : ""}>Diet Plan</Link>
                <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
                <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
                <Link to="/subscriptions" onClick={() => setMenu("subscriptions")} className={menu === "subscriptions" ? "active" : ""}>Subscriptions</Link>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="Search" />
                <div className="navbar-search-icon">
                    <Link to="/cart">
                        <img src={assets.basket_icon} alt="Cart" />
                    </Link>
                    {/* Add a safe way to show the cart dot */}
                    <div className={totalAmount === 0 ? "" : "dot"}></div>
                </div>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign in</button>
                ) : (
                    <div className="navbar-profile">
                        <img src={assets.profile_icon} alt="Profile" />
                        <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate('/myorders')}>
                                <img src={assets.bag_icon} alt="Orders" />
                                <p>Orders</p>
                            </li>
                            <li onClick={() => navigate('/my-subscriptions')}>
                                <img src={assets.subscriptions_icon} alt="Subscriptions" />
                                <p>My Subscriptions</p>
                            </li>
                            <hr />
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="Logout" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
