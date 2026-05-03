import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { JWT_SECRET } from "../middlewares/auth";
import { requireUser, UserRequest } from "../middlewares/requireUser";
import {
  RegisterUserBody,
  LoginUserBody,
  UpdateUserProfileBody,
  ChangeUserPasswordBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from "@workspace/api-zod";

const router = Router();

function toProfile(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt.toISOString(),
  };
}

function signUserToken(userId: number, email: string) {
  return jwt.sign({ userId, email, type: "user" }, JWT_SECRET, { expiresIn: "30d" });
}

// POST /users/register
router.post("/users/register", async (req, res) => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid registration data" });
    return;
  }
  const { fullName, email, phone, password } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
  if (existing[0]) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(usersTable)
    .values({ fullName, email: email.toLowerCase(), phone, passwordHash })
    .returning();

  const token = signUserToken(user.id, user.email);
  res.status(201).json({ token, user: toProfile(user) });
});

// POST /users/login
router.post("/users/login", async (req, res) => {
  const parsed = LoginUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid login data" });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signUserToken(user.id, user.email);
  res.json({ token, user: toProfile(user) });
});

// POST /users/logout
router.post("/users/logout", (_req, res) => {
  res.json({ message: "Logged out" });
});

// GET /users/me
router.get("/users/me", requireUser, async (req: UserRequest, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(toProfile(user));
});

// PUT /users/profile
router.put("/users/profile", requireUser, async (req: UserRequest, res) => {
  const parsed = UpdateUserProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid profile data" });
    return;
  }

  const updates: Partial<typeof usersTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (parsed.data.fullName !== undefined) updates.fullName = parsed.data.fullName;
  if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;

  const [user] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, req.userId!))
    .returning();

  res.json(toProfile(user));
});

// PUT /users/password
router.put("/users/password", requireUser, async (req: UserRequest, res) => {
  const parsed = ChangeUserPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ error: "Current password is incorrect" });
    return;
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.update(usersTable).set({ passwordHash: newHash, updatedAt: new Date() }).where(eq(usersTable.id, req.userId!));
  res.json({ message: "Password changed successfully" });
});

// POST /users/forgot-password
router.post("/users/forgot-password", async (req, res) => {
  const parsed = ForgotPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, parsed.data.email.toLowerCase())).limit(1);

  // Always return success to prevent email enumeration
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await db.update(usersTable).set({ resetToken: token, resetTokenExpiry: expiry }).where(eq(usersTable.id, user.id));
    // In a real app, send an email with the token. For now, log it.
    req.log?.info({ resetToken: token }, "Password reset token generated");
  }

  res.json({ message: "If that email is registered, a reset link has been sent." });
});

// POST /users/reset-password
router.post("/users/reset-password", async (req, res) => {
  const parsed = ResetPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.resetToken, parsed.data.token))
    .limit(1);

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    res.status(400).json({ error: "Invalid or expired reset token" });
    return;
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db
    .update(usersTable)
    .set({ passwordHash: newHash, resetToken: null, resetTokenExpiry: null, updatedAt: new Date() })
    .where(eq(usersTable.id, user.id));

  res.json({ message: "Password has been reset successfully" });
});

// DELETE /users/account
router.delete("/users/account", requireUser, async (req: UserRequest, res) => {
  await db.delete(usersTable).where(eq(usersTable.id, req.userId!));
  res.status(204).send();
});

export default router;
