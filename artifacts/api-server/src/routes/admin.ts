import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, reviewsTable, messagesTable, usersTable } from "@workspace/db";
import { count, avg, eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const [productCount] = await db.select({ count: count() }).from(productsTable);
  const [reviewCount] = await db.select({ count: count() }).from(reviewsTable);
  const [messageCount] = await db.select({ count: count() }).from(messagesTable);
  const [unreadCount] = await db.select({ count: count() }).from(messagesTable).where(eq(messagesTable.read, false));
  const [avgRating] = await db.select({ avg: avg(reviewsTable.rating) }).from(reviewsTable);

  const recentMessages = await db
    .select()
    .from(messagesTable)
    .orderBy(desc(messagesTable.createdAt))
    .limit(5);

  res.json({
    totalProducts: Number(productCount.count),
    totalReviews: Number(reviewCount.count),
    totalMessages: Number(messageCount.count),
    unreadMessages: Number(unreadCount.count),
    averageRating: avgRating.avg ? Math.round(Number(avgRating.avg) * 10) / 10 : 0,
    recentMessages: recentMessages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
  });
});

// GET /admin/users — list all registered users
router.get("/admin/users", requireAdmin, async (_req, res) => {
  const users = await db
    .select({
      id: usersTable.id,
      fullName: usersTable.fullName,
      email: usersTable.email,
      phone: usersTable.phone,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));

  res.json(
    users.map((u) => ({ ...u, phone: u.phone ?? "", createdAt: u.createdAt.toISOString() }))
  );
});

// PUT /admin/users/:id/password — change a user's password
router.put("/admin/users/:id/password", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { newPassword } = req.body as { newPassword?: string };

  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await db.update(usersTable).set({ passwordHash: hash, updatedAt: new Date() }).where(eq(usersTable.id, id));
  res.json({ message: "Password updated successfully" });
});

// DELETE /admin/users/:id — delete a user account
router.delete("/admin/users/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.status(204).send();
});

export default router;
