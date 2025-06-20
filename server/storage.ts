import { users, type User, type InsertUser, contacts, type Contact, type InsertContact, projects, type Project, type InsertProject, techStack, type TechStack, type InsertTechStack } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  getTechStack(): Promise<TechStack[]>;
  createTechStack(tech: InsertTechStack): Promise<TechStack>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.isActive, 1)).orderBy(projects.sortOrder);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async getTechStack(): Promise<TechStack[]> {
    return await db.select().from(techStack).where(eq(techStack.isActive, 1)).orderBy(techStack.sortOrder);
  }

  async createTechStack(insertTechStack: InsertTechStack): Promise<TechStack> {
    const [tech] = await db
      .insert(techStack)
      .values(insertTechStack)
      .returning();
    return tech;
  }
}

export const storage = new DatabaseStorage();
