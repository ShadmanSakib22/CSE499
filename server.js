import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

const app = express();
// Remove hardcoded PORT for Vercel
// const PORT = 4242;

app.use(cors());
app.use(express.json());

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
              name: `Support ticket: ${issue}`,
            },
            unit_amount: 1.5,
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

// Modify the listen method for Vercel
export default app;
