import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    getStaticPlans,
    getStaticPlanById,
    saveSubscription,
    createCheckoutSession,
    getUserSubscriptions,
    getSubscriptionsByUser,
} from "../controllers/SubscriptionController.js";

const router = express.Router();

// Routes for static plans
router.get("/plans", getStaticPlans);
router.get("/plans/:id", getStaticPlanById);

// Routes for subscriptions
router.post("/subscriptions/save-subscription", authMiddleware, saveSubscription);
router.post("/subscriptions/create-checkout-session", authMiddleware, createCheckoutSession);
router.get("/subscriptions", getUserSubscriptions);
router.get('/user-subscriptions', authMiddleware, getSubscriptionsByUser);

export default router;
