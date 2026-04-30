import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import { UpdateSettingsBody } from "@workspace/api-zod";

const router = Router();

async function getOrCreateSettings() {
  const existing = await db.select().from(settingsTable).limit(1);
  if (existing[0]) return existing[0];

  const [settings] = await db.insert(settingsTable).values({}).returning();
  return settings;
}

router.get("/settings", async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ ...settings, updatedAt: settings.updatedAt.toISOString() });
});

router.put("/settings", requireAdmin, async (req, res) => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid settings data" });
    return;
  }

  const existing = await getOrCreateSettings();

  const [settings] = await db
    .update(settingsTable)
    .set({
      ...(parsed.data.phone !== undefined && { phone: parsed.data.phone }),
      ...(parsed.data.whatsapp !== undefined && { whatsapp: parsed.data.whatsapp }),
      ...(parsed.data.address !== undefined && { address: parsed.data.address }),
      ...(parsed.data.instagramUrl !== undefined && { instagramUrl: parsed.data.instagramUrl }),
      ...(parsed.data.tiktokUrl !== undefined && { tiktokUrl: parsed.data.tiktokUrl }),
      updatedAt: new Date(),
    })
    .where(eq(settingsTable.id, existing.id))
    .returning();

  res.json({ ...settings, updatedAt: settings.updatedAt.toISOString() });
});

export default router;
