
import Razorpay from 'razorpay';
import Subscription from '../models/SubscriptionModel.js';



// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay Key Secret
});

// Static subscription plans
const getStaticPlans = async (req, res) => {
const staticPlans = [
    {
        id: 1,
        name: "Weight Loss Plan (Veg)",
        description: "Perfect plan for weight loss with balanced vegetarian meals.",
        price_1_day: 5,
        price_7_days: 30,
        price_30_days: 120,
        breakfast_price: 2,
        lunch_price: 3,
        dinner_price: 4,
        image: "https://via.placeholder.com/400x300"
    },
    {
        id: 2,
        name: "Weight Loss Plan (Non-Veg)",
        description: "Perfect plan for weight loss with balanced non-vegetarian meals.",
        price_1_day: 6,
        price_7_days: 35,
        price_30_days: 140,
        breakfast_price: 3,
        lunch_price: 4,
        dinner_price: 5,
        image: "https://via.placeholder.com/400x300"
    },
    // Add more plans as needed
];
res.json(staticPlans);
};
const getStaticPlanById = async (req, res) => {
    const staticPlans = [
        {
            id: 1,
            name: "Weight Loss Plan (Veg)",
            description: "Perfect plan for weight loss with balanced vegetarian meals.",
            price_1_day: 5,
            price_7_days: 30,
            price_30_days: 120,
            breakfast_price: 2,
            lunch_price: 3,
            dinner_price: 4,
            image: "https://via.placeholder.com/400x300"
        },
        {
            id: 2,
            name: "Weight Loss Plan (Non-Veg)",
            description: "Perfect plan for weight loss with balanced non-vegetarian meals.",
            price_1_day: 6,
            price_7_days: 35,
            price_30_days: 140,
            breakfast_price: 3,
            lunch_price: 4,
            dinner_price: 5,
            image: "https://via.placeholder.com/400x300"
        },
        // Same as above for consistency
    ];
    const plan = staticPlans.find((sub) => sub.id === parseInt(req.params.id));
    if (plan) {
        res.json(plan);
    } else {
        res.status(404).json({ message: "Plan not found" });
    }
};

// Save subscription
const saveSubscription = async (req, res) => {
    const { subscriptionId, mealType, duration, quantity, totalCost } = req.body;
    const userId = req.body.userId; // Extracted by authMiddleware

    if (!userId || !subscriptionId || !mealType || !duration || !quantity || !totalCost) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const subscription = new Subscription({
            userId,
            subscriptionId,
            mealType,
            duration,
            quantity,
            totalCost,
        });
        await subscription.save();
        res.status(201).json({ message: "Subscription saved successfully." });
    } catch (error) {
        console.error("Error saving subscription:", error.message);
        res.status(500).json({ error: "Failed to save subscription." });
    }
};

// Create Razorpay Checkout session
const createCheckoutSession = async (req, res) => {
    const { subscriptionId, mealType, duration, quantity, totalCost } = req.body;

    if (!subscriptionId || !mealType || !duration || !quantity || !totalCost) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const options = {
            amount: totalCost * 100, // Convert INR to paise
            currency: "INR",
            receipt: `subscription_${subscriptionId}_${mealType}_${duration}`,
            payment_capture: 1, // Auto-capture the payment
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            notes: options.receipt,
        });
    } catch (error) {
        console.error("Error creating Razorpay session:", error.message);
        res.status(500).json({ error: "Failed to create Razorpay session" });
    }
};

// Fetch all user subscriptions
const getUserSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.json(subscriptions);
    } catch (error) {
        console.error("Error fetching subscriptions:", error.message);
        res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
};
const getSubscriptionsByUser = async (req, res) => {
    try {
        const userId = req.body.userId; // Get user ID from middleware
        console.log("Fetching subscriptions for user:", userId);

        const subscriptions = await Subscription.find({ userId });
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({ success: false, message: "No subscriptions found." });
        }

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        console.error("Error fetching subscriptions:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



export { getStaticPlans, getStaticPlanById, saveSubscription, createCheckoutSession, getUserSubscriptions,getSubscriptionsByUser };
