import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      
      // Basic validation
      if (!contactData.name.trim()) {
        return res.status(400).json({ message: "Name is required" });
      }
      
      if (!contactData.email.trim()) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      if (!contactData.message.trim()) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactData.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const contact = await storage.createContact(contactData);
      
      // In a real application, you would send an email notification here
      console.log("New contact form submission:", contact);
      
      res.status(201).json({ 
        message: "Thank you! Your message has been sent successfully. I'll get back to you soon.",
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      
      console.error("Contact form error:", error);
      res.status(500).json({ 
        message: "Something went wrong. Please try again later." 
      });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ message: "Failed to retrieve contacts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
