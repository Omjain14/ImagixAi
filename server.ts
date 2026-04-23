import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- Middleware ---

const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// --- Auth Routes ---

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminEmails = ["omjain1401@gmail.com"];
    const userRole = adminEmails.includes(email) ? "admin" : "user";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        credits: 25,
        role: userRole,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: "Registration successful", user: { id: user.id, name: user.name, email: user.email, credits: user.credits, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email, credits: user.credits, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.get("/api/user/profile", authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { id: user.id, name: user.name, email: user.email, credits: user.credits, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Credit & Generation Routes ---

app.post("/api/credits/deduct", authenticateToken, async (req: any, res) => {
  const { amount = 5 } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.credits < amount) {
      return res.status(400).json({ error: "Insufficient credits" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        credits: { decrement: amount },
        creditHistory: {
          create: {
            amount: -amount,
            type: "deducted",
            reason: "Image generation"
          }
        }
      },
    });

    res.json({ success: true, credits: updatedUser.credits });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Payment Request Routes ---

app.post("/api/payment/request", authenticateToken, async (req: any, res) => {
  const { plan, amount, utrCode, date, note } = req.body;
  try {
    const request = await prisma.paymentRequest.create({
      data: {
        userId: req.user.id,
        plan,
        amount,
        utrCode,
        date: new Date(date),
        note,
        status: "pending"
      }
    });
    res.json({ message: "Payment request submitted. Admin will review within 24h.", request });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: "This UTR code has already been used." });
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/payment/my", authenticateToken, async (req: any, res) => {
  try {
    const payments = await prisma.paymentRequest.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Admin Routes ---

app.get("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/user/credits", authenticateToken, isAdmin, async (req, res) => {
  const { userId, amount, type, reason } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: type === "added" ? { increment: amount } : { decrement: amount },
        creditHistory: {
          create: { amount, type, reason }
        }
      }
    });
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/payments", authenticateToken, isAdmin, async (req, res) => {
  try {
    const payments = await prisma.paymentRequest.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/payment/approve", authenticateToken, isAdmin, async (req, res) => {
    const { paymentId } = req.body;
    try {
        const payment = await prisma.paymentRequest.findUnique({ where: { id: paymentId } });
        if (!payment || payment.status !== "pending") return res.status(400).json({ error: "Invalid payment request" });

        // Calculate credits based on plan
        let creditsToAdd = 0;
        if (payment.plan === "50 Credits") creditsToAdd = 50;
        else if (payment.plan === "100 Credits") creditsToAdd = 100;
        else if (payment.plan === "200 Credits") creditsToAdd = 200;

        await prisma.$transaction([
            prisma.paymentRequest.update({
                where: { id: paymentId },
                data: { status: "approved" }
            }),
            prisma.user.update({
                where: { id: payment.userId },
                data: { 
                    credits: { increment: creditsToAdd },
                    creditHistory: {
                        create: {
                            amount: creditsToAdd,
                            type: "added",
                            reason: `Plan Purchase: ${payment.plan}`
                        }
                    }
                }
            })
        ]);

        res.json({ success: true, message: "Payment approved and credits added" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/admin/payment/reject", authenticateToken, isAdmin, async (req, res) => {
    const { paymentId } = req.body;
    try {
        await prisma.paymentRequest.update({
            where: { id: paymentId },
            data: { status: "rejected" }
        });
        res.json({ success: true, message: "Payment rejected" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// --- Vite Middleware ---

async function startServer() {
  // Ensure default admin exists
  try {
    const adminEmail = "omjain1401@gmail.com";
    const adminPassword = "Omjain@1401";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "admin", password: hashedPassword },
      create: {
        email: adminEmail,
        name: "Admin Om",
        password: hashedPassword,
        role: "admin",
        credits: 999999
      }
    });
    console.log("Admin user checked/created");
  } catch (err) {
    console.error("Failed to ensure admin user:", err);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    // Only serve static files if NOT on Vercel (Vercel handles this via rewrites)
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel
export default app;

if (process.env.NODE_ENV !== "production") {
  startServer();
} else if (!process.env.VERCEL) {
  // If in production but not on Vercel (e.g. Docker), start the server
  startServer();
}
