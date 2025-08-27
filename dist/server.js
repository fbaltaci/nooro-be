"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());

// GET /tasks
app.get("/tasks", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield prisma.task.findMany();
    res.json(tasks);
  })
);

// POST /tasks
app.post("/tasks", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { title, color } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const task = yield prisma.task.create({
      data: { title, color, completed: false },
    });
    res.status(201).json(task);
  })
);

// PUT /tasks/:id
app.put("/tasks/:id", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, color, completed } = req.body;
    try {
      const task = yield prisma.task.update({
        where: { id: Number(id) },
        data: { title, color, completed },
      });
      res.json(task);
    } catch (_a) {
      res.status(404).json({ error: "Task not found" });
    }
  })
);

// DELETE /tasks/:id
app.delete("/tasks/:id", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.task.delete({ where: { id: Number(id) } });
    res.status(204).end();
  })
);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
