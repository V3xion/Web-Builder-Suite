import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { CreateReviewBody, DeleteReviewParams, UpdateReviewVisibilityParams, UpdateReviewVisibilityBody } from "@workspace/api-zod";

const router = Router();

router.get("/reviews", async (_req, res) => {
  const reviews = await db.select().from(reviewsTable).orderBy(reviewsTable.createdAt);
  res.json(reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/reviews", async (req, res) => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid review data" });
    return;
  }

  if (parsed.data.rating < 1 || parsed.data.rating > 5) {
    res.status(400).json({ error: "Rating must be between 1 and 5" });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      authorName: parsed.data.authorName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      approved: false,
    })
    .returning();

  res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
});

router.delete("/reviews/:id", requireAdmin, async (req, res) => {
  const parsed = DeleteReviewParams.safeParse({ id: req.params.id });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(reviewsTable).where(eq(reviewsTable.id, parsed.data.id));
  res.status(204).send();
});

router.patch("/reviews/:id", requireAdmin, async (req, res) => {
  const paramsParsed = UpdateReviewVisibilityParams.safeParse({ id: req.params.id });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = UpdateReviewVisibilityBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  const [review] = await db
    .update(reviewsTable)
    .set({ approved: bodyParsed.data.approved })
    .where(eq(reviewsTable.id, paramsParsed.data.id))
    .returning();

  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  res.json({ ...review, createdAt: review.createdAt.toISOString() });
});

export default router;
