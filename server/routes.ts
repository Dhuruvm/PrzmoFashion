import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendEmail } from "./smtp-service";
import { runEmailDiagnostics, getEmailDiagnostics } from "./email-diagnostics";
import { smtpRouter } from "./smtp-routes";
import { adminRouter } from "./admin-routes";
import { orderRouter } from "./order-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      version: "1.0.0" 
    });
  });

  // Email diagnostics endpoint
  app.get("/api/email-diagnostics", async (req, res) => {
    try {
      const diagnostics = await runEmailDiagnostics();
      res.json(diagnostics);
    } catch (error) {
      console.error("Email diagnostics error:", error);
      res.status(500).json({ error: "Failed to run diagnostics" });
    }
  });

  // Test SendGrid email endpoint
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, from, subject, text, html } = req.body;
      
      if (!to || !from || !subject) {
        return res.status(400).json({ 
          error: "Missing required fields: to, from, subject" 
        });
      }

      const success = await sendEmail({ to, from, subject, text, html });
      
      if (success) {
        res.json({ success: true, message: "Email sent successfully" });
      } else {
        res.status(500).json({ success: false, error: "Failed to send email" });
      }
    } catch (error) {
      console.error("Email endpoint error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  // User management endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (user) {
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          error: "Missing required fields: username, password" 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      const user = await storage.createUser({ username, password });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mount SMTP routes
  app.use('/api/smtp', smtpRouter);
  
  // Mount admin routes
  app.use('/api/admin', adminRouter);
  
  // Mount order routes
  app.use('/api/orders', orderRouter);

  const httpServer = createServer(app);

  return httpServer;
}
