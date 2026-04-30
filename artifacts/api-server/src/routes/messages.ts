import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { CreateMessageBody, DeleteMessageParams, MarkMessageReadParams, MarkMessageReadBody } from "@workspace/api-zod";

const router = Router();

router.get("/messages", requireAdmin, async (_req, res) => {
  const messages = await db.select().from(messagesTable).orderBy(messagesTable.createdAt);
  res.json(messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })));
});

router.post("/messages", async (req, res) => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid message data" });
    return;
  }

  const [message] = await db
    .insert(messagesTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    })
    .returning();

  res.status(201).json({ ...message, createdAt: message.createdAt.toISOString() });
});

router.delete("/messages/:id", requireAdmin, async (req, res) => {
  const parsed = DeleteMessageParams.safeParse({ id: req.params.id });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(messagesTable).where(eq(messagesTable.id, parsed.data.id));
  res.status(204).send();
});

router.patch("/messages/:id", requireAdmin, async (req, res) => {
  const paramsParsed = MarkMessageReadParams.safeParse({ id: req.params.id });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = MarkMessageReadBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  const [message] = await db
    .update(messagesTable)
    .set({ read: bodyParsed.data.read })
    .where(eq(messagesTable.id, paramsParsed.data.id))
    .returning();

  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  res.json({ ...message, createdAt: message.createdAt.toISOString() });
});

export default router;
