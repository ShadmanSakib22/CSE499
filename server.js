import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

const app = express();
// Remove hardcoded PORT for Vercel
// const PORT = 4242;

app.use(
  cors({
    origin: ["https://cse-499.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Ticket submission endpoint
app.post("/create-checkout-session", async (req, res) => {
  const { email, issue, description, budget, timezone, operatingsys } =
    req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `TechSolutions: Support Ticket: ${issue}`,
              description:
                "For security purposes, we require you to pay a fine of $0.50 per ticket submission.",
              images: ["https://cse-499.vercel.app/ticket-stripe.jpg"],
            },
            unit_amount: 0.5,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `https://cse-499.vercel.app/ticket?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://cse-499.vercel.app/ticket?payment=cancelled`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New subscription endpoint
app.post("/create-subscription", async (req, res) => {
  const { email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            recurring: {
              interval: "month",
            },
            product_data: {
              name: "TechSolutions Premium Subscription",
              description: "Monthly subscription for premium support",
              images: ["https://cse-499.vercel.app/premium-stripe.jpg"],
            },
            unit_amount: 3000, // $30.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: email,
      success_url: `https://cse-499.vercel.app/subscription?status=success`,
      cancel_url: `https://cse-499.vercel.app/subscription?status=cancelled`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
});

// Modify the listen method for Vercel
export default app;
