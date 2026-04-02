import "dotenv/config";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";

const PORT = process.env.PORT || 3001;
let server: http.Server;

async function startServer() {
  try {
    await connectDB();
    server = http.createServer(app);
    server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (error) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
}

// Graceful shutdown with 10s timeout
async function shutdown(signal: string) {
  logger.warn(`${signal} received, shutting down`);
  if (server) {
    server.close(async () => {
      const mongoose = await import("mongoose");
      await mongoose.default.connection.close();
      logger.info("Shutdown completed");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", (error) => {
  logger.error({ err: error }, "Uncaught Exception");
  shutdown("uncaughtException");
});
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled Rejection");
  shutdown("unhandledRejection");
});

startServer();
