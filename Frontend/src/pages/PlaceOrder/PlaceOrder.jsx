import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Please log in to proceed with the order.");
      navigate('/login');
    } else if (getTotalCartAmount() === 0) {
      alert("Your cart is empty. Add items to your cart before placing an order.");
      navigate('/cart');
    }
  }, [token, navigate, getTotalCartAmount]);

  const placeOrder = async (event) => {
    event.preventDefault();

    // Prepare order items
    const orderItems = food_list.reduce((acc, item) => {
      if (cartItems[item._id] > 0) {
        acc.push({ name: item.name, price: item.price, quantity: cartItems[item._id] });
      }
      return acc;
    }, []);

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getTotalCartAmount() + 2, // Including delivery fee
      userId: token, // Pass user ID (assuming token includes the user ID)
    };

    try {
      // Step 1: Place an order and get Razorpay order ID
      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        const { order_id, amount } = response.data;

        // Step 2: Initialize Razorpay payment
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          const options = {
            key: "rzp_test_SyFe1hELG5eMsl", // Razorpay key
            amount, // Amount in paise
            currency: "INR",
            name: "Cloud Kitchen",
            description: "Order Payment",
            order_id, // Razorpay order ID from server
            handler: async (paymentResponse) => {
              try {
                // Step 3: Verify payment
                const verificationResponse = await axios.post(
                  `${url}/api/order/verify`,
                  {
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                  },
                  {
                    headers: { token },
                  }
                );

                if (verificationResponse.data.success) {
                  alert("Payment successful! Your order has been placed.");
                  navigate('/myorders'); // Redirect to My Orders page
                } else {
                  alert("Failed to verify the payment. Please contact support.");
                }
              } catch (error) {
                console.error("Error verifying payment:", error.message);
                alert("Failed to verify the payment. Please try again.");
              }
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: "#28a745",
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        };

        document.body.appendChild(script);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("Failed to place the order. Please try again.");
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={formData.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={formData.email}
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={formData.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={formData.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={formData.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={formData.zipcode}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={formData.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={formData.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
