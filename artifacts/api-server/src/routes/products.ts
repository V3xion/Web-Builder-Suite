import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { ListProductsQueryParams, CreateProductBody, UpdateProductBody, GetProductParams, UpdateProductParams, DeleteProductParams } from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const { category, search, featured } = parsed.data;
  const conditions = [];

  if (category) conditions.push(eq(productsTable.category, category));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
  if (featured !== undefined) conditions.push(eq(productsTable.featured, featured));

  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(productsTable.createdAt);

  const mapped = products.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
  }));

  res.json(mapped);
});

router.get("/products/:id", async (req, res) => {
  const parsed = GetProductParams.safeParse({ id: req.params.id });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.id))
    .limit(1);

  if (!product[0]) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({ ...product[0], price: Number(product[0].price), createdAt: product[0].createdAt.toISOString() });
});

router.post("/products", requireAdmin, async (req, res) => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid product data", details: parsed.error });
    return;
  }

  const [product] = await db
    .insert(productsTable)
    .values({
      name: parsed.data.name,
      nameAr: parsed.data.nameAr ?? null,
      category: parsed.data.category,
      description: parsed.data.description,
      descriptionAr: parsed.data.descriptionAr ?? null,
      price: String(parsed.data.price),
      imageUrl: parsed.data.imageUrl,
      featured: parsed.data.featured ?? false,
    })
    .returning();

  res.status(201).json({ ...product, price: Number(product.price), createdAt: product.createdAt.toISOString() });
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  const paramsParsed = UpdateProductParams.safeParse({ id: req.params.id });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = UpdateProductBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid product data" });
    return;
  }

  const [product] = await db
    .update(productsTable)
    .set({
      name: bodyParsed.data.name,
      nameAr: bodyParsed.data.nameAr ?? null,
      category: bodyParsed.data.category,
      description: bodyParsed.data.description,
      descriptionAr: bodyParsed.data.descriptionAr ?? null,
      price: String(bodyParsed.data.price),
      imageUrl: bodyParsed.data.imageUrl,
      featured: bodyParsed.data.featured ?? false,
    })
    .where(eq(productsTable.id, paramsParsed.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({ ...product, price: Number(product.price), createdAt: product.createdAt.toISOString() });
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  const parsed = DeleteProductParams.safeParse({ id: req.params.id });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(productsTable).where(eq(productsTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
