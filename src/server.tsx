import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// GET /tasks
app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// GET /tasks/:id (single)
app.get("/tasks/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id))
    return res.status(400).json({ error: "Invalid id" });

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// POST /tasks
app.post("/tasks", async (req: Request, res: Response) => {
  const { title, color } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const task = await prisma.task.create({
    data: { title, color, completed: false },
  });
  res.status(201).json(task);
});

// PUT /tasks/:id
app.put("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, color, completed } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, color, completed },
    });
    res.json(task);
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: Number(id) } });
  res.status(204).end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
