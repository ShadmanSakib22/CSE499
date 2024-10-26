import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

const app = express();
const PORT = 4242;

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
            unit_amount: 50, // Set your fee in cents (e.g., $0.50 = 50 cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `http://localhost:5173/ticket?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/ticket?payment=cancelled`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
