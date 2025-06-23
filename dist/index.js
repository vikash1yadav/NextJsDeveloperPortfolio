var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminSessions: () => adminSessions,
  admins: () => admins,
  blogPosts: () => blogPosts,
  contacts: () => contacts,
  insertAdminSchema: () => insertAdminSchema,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertContactSchema: () => insertContactSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertTechStackSchema: () => insertTechStackSchema,
  insertUserSchema: () => insertUserSchema,
  projects: () => projects,
  techStack: () => techStack,
  users: () => users
});
import { pgTable, text, serial, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var contacts, insertContactSchema, users, insertUserSchema, projects, insertProjectSchema, techStack, insertTechStackSchema, blogPosts, insertBlogPostSchema, admins, adminSessions, insertAdminSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    contacts = pgTable("contacts", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      email: text("email").notNull(),
      subject: text("subject"),
      message: text("message").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertContactSchema = createInsertSchema(contacts).omit({
      id: true,
      createdAt: true
    });
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      password: text("password").notNull()
    });
    insertUserSchema = createInsertSchema(users).pick({
      username: true,
      password: true
    });
    projects = pgTable("projects", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      image: text("image").notNull(),
      category: text("category").notNull(),
      tags: json("tags").$type().notNull(),
      primaryTags: json("primary_tags").$type().notNull(),
      demoUrl: text("demo_url").notNull(),
      githubUrl: text("github_url").notNull(),
      isActive: integer("is_active").default(1).notNull(),
      sortOrder: integer("sort_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProjectSchema = createInsertSchema(projects).omit({
      id: true,
      createdAt: true
    });
    techStack = pgTable("tech_stack", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      icon: text("icon").notNull(),
      bg: text("bg").notNull(),
      description: text("description").notNull(),
      category: text("category").notNull(),
      // frontend, backend, database, tools
      isActive: integer("is_active").default(1).notNull(),
      sortOrder: integer("sort_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTechStackSchema = createInsertSchema(techStack).omit({
      id: true,
      createdAt: true
    });
    blogPosts = pgTable("blog_posts", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      slug: text("slug").unique().notNull(),
      content: text("content").notNull(),
      excerpt: text("excerpt").notNull(),
      featuredImage: text("featured_image"),
      tags: json("tags").$type().notNull().default([]),
      category: text("category").notNull(),
      isPublished: integer("is_published").default(1).notNull(),
      publishedAt: timestamp("published_at").defaultNow(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertBlogPostSchema = createInsertSchema(blogPosts).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    admins = pgTable("admins", {
      id: serial("id").primaryKey(),
      username: text("username").unique().notNull(),
      password: text("password").notNull(),
      // Will be hashed
      email: text("email").unique().notNull(),
      isActive: integer("is_active").default(1).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    adminSessions = pgTable("admin_sessions", {
      id: text("id").primaryKey(),
      adminId: integer("admin_id").references(() => admins.id).notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertAdminSchema = createInsertSchema(admins).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();

// server/db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "pg";
import dotEnv from "dotenv";
dotEnv.config();
var pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || "5432")
});
var db = drizzle(pool);

// server/storage.ts
import { eq, desc, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async createContact(insertContact) {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
  async getContacts() {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }
  async getProjects() {
    return await db.select().from(projects).where(eq(projects.isActive, 1)).orderBy(projects.sortOrder);
  }
  async getProject(id) {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || void 0;
  }
  async createProject(insertProject) {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }
  async getTechStack() {
    return await db.select().from(techStack).where(eq(techStack.isActive, 1)).orderBy(techStack.sortOrder);
  }
  async createTechStack(insertTechStack) {
    const [tech] = await db.insert(techStack).values(insertTechStack).returning();
    return tech;
  }
  async getBlogPosts() {
    return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, 1)).orderBy(desc(blogPosts.publishedAt));
  }
  async getBlogPost(id) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || void 0;
  }
  async getBlogPostBySlug(slug) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || void 0;
  }
  async createBlogPost(insertBlogPost) {
    const [post] = await db.insert(blogPosts).values(insertBlogPost).returning();
    return post;
  }
  async updateBlogPost(id, updateData) {
    const [post] = await db.update(blogPosts).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(blogPosts.id, id)).returning();
    return post;
  }
  async deleteBlogPost(id) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  // Admin operations
  async createAdmin(insertAdmin) {
    const hashedPassword = await bcrypt.hash(insertAdmin.password, 10);
    const [admin] = await db.insert(admins).values({
      ...insertAdmin,
      password: hashedPassword
    }).returning();
    return admin;
  }
  async getAdminByUsername(username) {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || void 0;
  }
  async verifyAdminPassword(username, password) {
    const admin = await this.getAdminByUsername(username);
    if (!admin || admin.isActive !== 1) {
      return null;
    }
    const isValid = await bcrypt.compare(password, admin.password);
    return isValid ? admin : null;
  }
  async createAdminSession(adminId) {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    const [session] = await db.insert(adminSessions).values({
      id: sessionId,
      adminId,
      expiresAt
    }).returning();
    return session;
  }
  async getAdminSession(sessionId) {
    const [result] = await db.select({
      admin: admins,
      session: adminSessions
    }).from(adminSessions).innerJoin(admins, eq(adminSessions.adminId, admins.id)).where(eq(adminSessions.id, sessionId)).where(gt(adminSessions.expiresAt, /* @__PURE__ */ new Date()));
    return result || null;
  }
  async deleteAdminSession(sessionId) {
    await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
  }
  async updateProject(id, updateData) {
    const [project] = await db.update(projects).set(updateData).where(eq(projects.id, id)).returning();
    return project;
  }
  async deleteProject(id) {
    await db.delete(projects).where(eq(projects.id, id));
  }
  async updateTechStack(id, updateData) {
    const [tech] = await db.update(techStack).set(updateData).where(eq(techStack.id, id)).returning();
    return tech;
  }
  async deleteTechStack(id) {
    await db.delete(techStack).where(eq(techStack.id, id));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
init_schema();
import { z } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      if (!contactData.name.trim()) {
        return res.status(400).json({ message: "Name is required" });
      }
      if (!contactData.email.trim()) {
        return res.status(400).json({ message: "Email is required" });
      }
      if (!contactData.message.trim()) {
        return res.status(400).json({ message: "Message is required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactData.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const contact = await storage.createContact(contactData);
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
  app2.get("/api/contacts", async (req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      res.json(contacts2);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ message: "Failed to retrieve contacts" });
    }
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.json(projects2);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Failed to retrieve projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
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
  app2.get("/api/projects/:id", async (req, res) => {
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
  app2.get("/api/tech-stack", async (req, res) => {
    try {
      const techStack2 = await storage.getTechStack();
      res.json(techStack2);
    } catch (error) {
      console.error("Get tech stack error:", error);
      res.status(500).json({ message: "Failed to retrieve technology stack" });
    }
  });
  app2.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ message: "Failed to retrieve blog posts" });
    }
  });
  app2.get("/api/blog/:id", async (req, res) => {
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
  app2.post("/api/blog", async (req, res) => {
    try {
      const { insertBlogPostSchema: insertBlogPostSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertBlogPostSchema2.parse(req.body);
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
  app2.put("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      const { insertBlogPostSchema: insertBlogPostSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertBlogPostSchema2.partial().parse(req.body);
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
  app2.delete("/api/blog/:id", async (req, res) => {
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
  const requireAdmin = async (req, res, next) => {
    try {
      const sessionId = req.headers.authorization?.replace("Bearer ", "");
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
  app2.post("/api/admin/login", async (req, res) => {
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
  app2.post("/api/admin/logout", requireAdmin, async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace("Bearer ", "");
      if (sessionId) {
        await storage.deleteAdminSession(sessionId);
      }
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });
  app2.get("/api/admin/me", requireAdmin, async (req, res) => {
    res.json({
      admin: {
        id: req.admin.id,
        username: req.admin.username,
        email: req.admin.email
      }
    });
  });
  app2.put("/api/admin/projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      const { insertProjectSchema: insertProjectSchema3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertProjectSchema3.partial().parse(req.body);
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
  app2.delete("/api/admin/projects/:id", requireAdmin, async (req, res) => {
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
  app2.post("/api/admin/projects", requireAdmin, async (req, res) => {
    try {
      const { insertProjectSchema: insertProjectSchema3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertProjectSchema3.parse(req.body);
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
  app2.put("/api/admin/tech-stack/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tech stack ID" });
      }
      const { insertTechStackSchema: insertTechStackSchema3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertTechStackSchema3.partial().parse(req.body);
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
  app2.delete("/api/admin/tech-stack/:id", requireAdmin, async (req, res) => {
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
  app2.post("/api/admin/tech-stack", requireAdmin, async (req, res) => {
    try {
      const { insertTechStackSchema: insertTechStackSchema3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertTechStackSchema3.parse(req.body);
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
  app2.post("/api/admin/create-default", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { dirname } from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      //`${__dirname}/client/src`,//
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        //import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotEnv2 from "dotenv";
dotEnv2.config();
console.log("ppp", import.meta.dirname, process.env.DATABASE_URL);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
