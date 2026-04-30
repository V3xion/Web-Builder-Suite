import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, reviewsTable, messagesTable } from "@workspace/db";
import { count, avg, eq, desc } from "drizzle-orm";
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

export default router;
