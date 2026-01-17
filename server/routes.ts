import type { Express }  from "express";
import type { Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Since we are using Supabase directly from the frontend,
  // we don't need any backend routes.
  // We keep this file to satisfy the template requirements.

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
