const connectDB = require("./config/db");
const createApp = require("./app");

const PORT = process.env.PORT || 3000;
const app = createApp();

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      const mongoose = require("mongoose");
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((error) => {
  console.error("Unable to start server:", error.message);
  process.exit(1);
});