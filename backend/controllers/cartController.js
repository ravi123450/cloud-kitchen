import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Validate input
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "User ID and Item ID are required" });
    }

    // Fetch user data
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize cartData if it doesn't exist
    let cartData = userData.cartData || {};

    // Update cart data
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    // Save updated cart data
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Validate input
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "User ID and Item ID are required" });
    }

    // Fetch user data
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize cartData if it doesn't exist
    let cartData = userData.cartData || {};

    // Remove or decrement item in cart
    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      // Remove item from cart if quantity is 0
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }

      // Save updated cart data
      await userModel.findByIdAndUpdate(userId, { cartData });

      res.json({ success: true, message: "Removed from cart" });
    } else {
      res.status(400).json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Fetch user data
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get cart data
    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, removeFromCart, getCart };
