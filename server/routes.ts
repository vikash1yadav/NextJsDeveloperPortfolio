import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertProjectSchema, insertTechStackSchema } from "@shared/schema";
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

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Failed to retrieve projects" });
    }
  });

  // Get single project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Failed to retrieve project" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Failed to retrieve project" });
    }
  });

  // Get technology stack
  app.get("/api/tech-stack", async (req, res) => {
    try {
      const techStack = await storage.getTechStack();
      res.json(techStack);
    } catch (error) {
      console.error("Get tech stack error:", error);
      res.status(500).json({ message: "Failed to retrieve technology stack" });
    }
  });

  // Blog endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ message: "Failed to retrieve blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Get blog post error:", error);
      res.status(500).json({ message: "Failed to retrieve blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const { insertBlogPostSchema } = await import("@shared/schema");
      const validatedData = insertBlogPostSchema.parse(req.body);
      
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json({
        message: "Blog post created successfully",
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      
      console.error("Create blog post error:", error);
      res.status(500).json({ 
        message: "Something went wrong. Please try again later." 
      });
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }

      const { insertBlogPostSchema } = await import("@shared/schema");
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      
      const post = await storage.updateBlogPost(id, validatedData);
      res.json({
        message: "Blog post updated successfully",
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      
      console.error("Update blog post error:", error);
      res.status(500).json({ 
        message: "Something went wrong. Please try again later." 
      });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      await storage.deleteBlogPost(id);
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
