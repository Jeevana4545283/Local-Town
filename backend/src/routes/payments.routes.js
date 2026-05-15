const express = require('express');
const router = express.Router();

router.post('/create-order', async (req, res) => {
  const razorpay = req.app.get('razorpay');
  const { amount } = req.body;

  if (!amount) return res.status(400).json({ message: "Amount required" });

  try {
    const options = {
      amount: Math.round(amount * 100), // Amount in Paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: "Order failed", error });
  }
});

module.exports = router;