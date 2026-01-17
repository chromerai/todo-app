import { db } from "./db";
import {
  lists,
  tasks,
  type List,
  type InsertList,
  type Task,
  type InsertTask,
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Lists
  getLists(userId: string): Promise<List[]>;
  getList(id: number): Promise<List | undefined>;
  createList(list: InsertList): Promise<List>;
  updateList(id: number, updates: Partial<InsertList>): Promise<List>;
  deleteList(id: number): Promise<void>;

  // Tasks
  getTasks(listId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Lists
  async getLists(userId: string): Promise<List[]> {
    return await db.select().from(lists).where(eq(lists.userId, userId)).orderBy(desc(lists.createdAt));
  }

  async getList(id: number): Promise<List | undefined> {
    const [list] = await db.select().from(lists).where(eq(lists.id, id));
    return list;
  }

  async createList(list: InsertList): Promise<List> {
    const [newList] = await db.insert(lists).values(list).returning();
    return newList;
  }

  async updateList(id: number, updates: Partial<InsertList>): Promise<List> {
    const [updatedList] = await db
      .update(lists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lists.id, id))
      .returning();
    return updatedList;
  }

  async deleteList(id: number): Promise<void> {
    // Tasks will be deleted via cascade, but we can also be explicit if needed.
    // Drizzle cascade should handle it if configured in DB, but here we defined it in schema.
    await db.delete(lists).where(eq(lists.id, id));
  }

  // Tasks
  async getTasks(listId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.listId, listId)).orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
}

export const storage = new DatabaseStorage();
