import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import {
  handleSignup,
  handleLogin,
  handlePhoneLogin,
  handleMe,
  handleLogout,
  handleUpdateProfile,
} from "./routes/auth";
import {
  handleGetRequests,
  handleGetRequest,
  handleCreateRequest,
  handleUpdateRequest,
  handleDeleteRequest,
  handleCreateProposal,
  handleUpdateProposal,
  handleGetNearbyRequests,
} from "./routes/requests";
import {
  handleGetConversations,
  handleGetConversation,
  handleCreateConversation,
  handleGetMessages,
  handleSendMessage,
  handleUpdateMessage,
  handleMarkAsRead,
  handleDeleteMessage,
} from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({ credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/login-phone", handlePhoneLogin);
  app.get("/api/auth/me", handleMe);
  app.post("/api/auth/logout", handleLogout);
  app.put("/api/auth/profile", handleUpdateProfile);

  // Request routes
  app.get("/api/requests", handleGetRequests);
  app.get("/api/requests/nearby", handleGetNearbyRequests);
  app.get("/api/requests/:id", handleGetRequest);
  app.post("/api/requests", handleCreateRequest);
  app.put("/api/requests/:id", handleUpdateRequest);
  app.delete("/api/requests/:id", handleDeleteRequest);
  app.post("/api/requests/:id/proposals", handleCreateProposal);
  app.put(
    "/api/requests/:requestId/proposals/:proposalId",
    handleUpdateProposal,
  );

  // Chat routes
  app.get("/api/conversations", handleGetConversations);
  app.get("/api/conversations/:id", handleGetConversation);
  app.post("/api/conversations", handleCreateConversation);
  app.get("/api/conversations/:id/messages", handleGetMessages);
  app.post("/api/conversations/:id/messages", handleSendMessage);
  app.put("/api/conversations/:id/messages/:messageId", handleUpdateMessage);
  app.put("/api/conversations/:id/read", handleMarkAsRead);
  app.delete("/api/conversations/:id/messages/:messageId", handleDeleteMessage);

  return app;
}
