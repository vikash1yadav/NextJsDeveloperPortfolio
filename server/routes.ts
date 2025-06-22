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

  // Admin authentication middleware
  const requireAdmin = async (req: any, res: any, next: any) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (!sessionId) {
        return res.status(401).json({ message: "No session token provided" });
      }

      const session = await storage.getAdminSession(sessionId);
      if (!session) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }

      req.admin = session.admin;
      next();
    } catch (error) {
      console.error("Admin auth error:", error);
      res.status(500).json({ message: "Authentication error" });
    }
  };

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const admin = await storage.verifyAdminPassword(username, password);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const session = await storage.createAdminSession(admin.id);
      res.json({
        message: "Login successful",
        sessionToken: session.id,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", requireAdmin, async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (sessionId) {
        await storage.deleteAdminSession(sessionId);
      }
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Admin verify session
  app.get("/api/admin/me", requireAdmin, async (req, res) => {
    res.json({
      admin: {
        id: req.admin.id,
        username: req.admin.username,
        email: req.admin.email
      }
    });
  });

  // Admin project management
  app.put("/api/admin/projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const { insertProjectSchema } = await import("@shared/schema");
      const validatedData = insertProjectSchema.partial().parse(req.body);
      
      const project = await storage.updateProject(id, validatedData);
      res.json({
        message: "Project updated successfully",
        project: {
          id: project.id,
          title: project.title
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      
      console.error("Update project error:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.post("/api/admin/projects", requireAdmin, async (req, res) => {
    try {
      const { insertProjectSchema } = await import("@shared/schema");
      const validatedData = insertProjectSchema.parse(req.body);
      
      const project = await storage.createProject(validatedData);
      res.status(201).json({
        message: "Project created successfully",
        project: {
          id: project.id,
          title: project.title
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      
      console.error("Create project error:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Admin tech stack management
  app.put("/api/admin/tech-stack/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tech stack ID" });
      }

      const { insertTechStackSchema } = await import("@shared/schema");
      const validatedData = insertTechStackSchema.partial().parse(req.body);
      
      const tech = await storage.updateTechStack(id, validatedData);
      res.json({
        message: "Tech stack updated successfully",
        tech: {
          id: tech.id,
          name: tech.name
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      
      console.error("Update tech stack error:", error);
      res.status(500).json({ message: "Failed to update tech stack" });
    }
  });

  app.delete("/api/admin/tech-stack/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tech stack ID" });
      }
      
      await storage.deleteTechStack(id);
      res.json({ message: "Tech stack deleted successfully" });
    } catch (error) {
      console.error("Delete tech stack error:", error);
      res.status(500).json({ message: "Failed to delete tech stack" });
    }
  });

  app.post("/api/admin/tech-stack", requireAdmin, async (req, res) => {
    try {
      const { insertTechStackSchema } = await import("@shared/schema");
      const validatedData = insertTechStackSchema.parse(req.body);
      
      const tech = await storage.createTechStack(validatedData);
      res.status(201).json({
        message: "Tech stack created successfully",
        tech: {
          id: tech.id,
          name: tech.name
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors 
        });
      }
      
      console.error("Create tech stack error:", error);
      res.status(500).json({ message: "Failed to create tech stack" });
    }
  });

  // Create default admin user for demo
  app.post("/api/admin/create-default", async (req, res) => {
    try {
      const existingAdmin = await storage.getAdminByUsername("admin");
      if (existingAdmin) {
        return res.json({ message: "Default admin already exists" });
      }

      await storage.createAdmin({
        username: "admin",
        password: "password",
        email: "admin@example.com",
        isActive: 1
      });

      res.json({ message: "Default admin created successfully" });
    } catch (error) {
      console.error("Create default admin error:", error);
      res.status(500).json({ message: "Failed to create default admin" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
