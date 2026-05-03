import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  category: text("category").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({
  id: true,
  createdAt: true,
  read: true,
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().default("+971567772003"),
  whatsapp: text("whatsapp").notNull().default("https://wa.me/971567772003"),
  address: text("address").notNull().default("Refah Gift Market, Industrial Area, Shiebat Al Salam, Abu Dhabi"),
  instagramUrl: text("instagram_url").notNull().default("https://instagram.com"),
  tiktokUrl: text("tiktok_url").notNull().default("https://tiktok.com"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Settings = typeof settingsTable.$inferSelect;

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  passwordHash: true,
  resetToken: true,
  resetTokenExpiry: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
