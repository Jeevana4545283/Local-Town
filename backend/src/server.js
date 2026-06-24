require("dotenv").config();

const http = require("http");
//const Razorpay = require("razorpay");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const { app } = require("./app");
const { initSocket } = require("./socket");

// AI Routes
const aiRoutes = require("./routes/ai.routes");

const PORT = process.env.PORT || 4000;

// -----------------------------
// Razorpay Setup
// -----------------------------
//const razorpay = new Razorpay({
  //key_id: process.env.RAZORPAY_KEY_ID,
  //key_secret: process.env.RAZORPAY_KEY_SECRET,
//});

// Make Razorpay available globally
//app.set("razorpay", razorpay);

// -----------------------------
// Gemini AI Setup
// -----------------------------
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// Store Gemini globally if needed
app.set("genAI", genAI);

// -----------------------------
// Routes
// -----------------------------
app.use("/api/ai", aiRoutes);

// -----------------------------
// Start Server
// -----------------------------
async function main() {
  try {
    // Create HTTP Server
    const server = http.createServer(app);

    // Initialize Socket.IO
    initSocket(server);

    // Start Server
    server.listen(PORT, () => {
      console.log(
        `🚀 SmartTown Server running on http://localhost:${PORT}`
      );

      console.log("✅ Prisma MySQL Ready");
      console.log("✅ Razorpay Initialized");
      console.log("✅ Gemini AI Connected");
    });

  } catch (err) {
    console.error("🔥 Server startup failed:", err);
    process.exit(1);
  }
}

main();