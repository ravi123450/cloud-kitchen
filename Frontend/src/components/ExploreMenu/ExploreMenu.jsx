import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import nuvolaLogo from '../../assets/logo.png'; // Import Nuvola logo
import { useNavigate } from 'react-router-dom';

const ExploreMenu = ({ setCategory }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (menu_name) => {
        setCategory(menu_name); // Update selected category
        navigate('/top-dishes', { state: { category: menu_name } }); // Navigate with category
    };

    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Meal Plans</h1>
            <p className='explore-menu-text'>
                Welcome to our nutritious food ordering platform! Browse our menu and order your favorite dishes for a delightful dining experience.
            </p>

            <div className="explore-menu-list">
                {menu_list.map((item, index) => (
                    <div
                        key={index}
                        className="explore-menu-list-items"
                        onClick={() => handleCategoryClick(item.menu_name)}
                    >
                        {/* Nuvola Logo */}
                        <div className="card-logo">
                            <img src={nuvolaLogo} alt="Nuvola Logo" />
                        </div>

                        {/* Menu Image */}
                        <img
                            src={item.menu_image}
                            alt={item.menu_name}
                            className="menu-image"
                        />
                        <p>{item.menu_name}</p>
                    </div>
                ))}
            </div>
            <hr />
        </div>
    );
};

export default ExploreMenu;
