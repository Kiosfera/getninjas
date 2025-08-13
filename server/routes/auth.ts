import { RequestHandler } from "express";
import { z } from "zod";

// Mock database for development
const users: any[] = [];
const sessions: Map<string, string> = new Map();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  name: z.string().min(2),
  type: z.enum(["client", "professional"]),
  location: z
    .object({
      city: z.string(),
      state: z.string(),
    })
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const phoneLoginSchema = z.object({
  phone: z.string(),
  code: z.string().length(6),
});

// Mock session generation
function generateSessionId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Mock password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return `hashed_${password}`;
}

function verifyPassword(password: string, hash: string): boolean {
  return `hashed_${password}` === hash;
}

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    // Create user
    const user = {
      id: `user_${Date.now()}`,
      email: data.email,
      phone: data.phone,
      name: data.name,
      type: data.type,
      verified: false,
      createdAt: new Date().toISOString(),
      location: data.location,
      password: hashPassword(data.password),
      avatar: "/placeholder.svg",
      // Professional specific defaults
      ...(data.type === "professional" && {
        profession: "",
        categories: [],
        serviceRadius: 10,
        rating: 0,
        reviewCount: 0,
      }),
      // Client specific defaults
      ...(data.type === "client" && {
        preferredPaymentMethod: "",
      }),
    };

    users.push(user);

    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, user.id);

    // Set session cookie
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user without password
    const { password, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Dados inválidos", errors: error.errors });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, user.id);

    // Set session cookie
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user without password
    const { password: _, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos" });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const handlePhoneLogin: RequestHandler = async (req, res) => {
  try {
    const { phone, code } = phoneLoginSchema.parse(req.body);

    // Mock verification (in production, verify SMS code)
    if (code !== "123456") {
      return res.status(401).json({ message: "Código inválido" });
    }

    // Find user by phone
    let user = users.find((u) => u.phone === phone);

    if (!user) {
      // Create user if doesn't exist (simplified flow)
      user = {
        id: `user_${Date.now()}`,
        email: `${phone}@phone.temp`,
        phone: phone,
        name: "Usuário",
        type: "client",
        verified: true,
        createdAt: new Date().toISOString(),
        avatar: "/placeholder.svg",
        password: "",
      };
      users.push(user);
    }

    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, user.id);

    // Set session cookie
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user without password
    const { password, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos" });
    }
    console.error("Phone login error:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const handleMe: RequestHandler = async (req, res) => {
  try {
    const sessionId = req.cookies.session;
    if (!sessionId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ message: "Sessão inválida" });
    }

    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Return user without password
    const { password, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  try {
    const sessionId = req.cookies.session;
    if (sessionId) {
      sessions.delete(sessionId);
    }

    res.clearCookie("session");
    res.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const handleUpdateProfile: RequestHandler = async (req, res) => {
  try {
    const sessionId = req.cookies.session;
    if (!sessionId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ message: "Sessão inválida" });
    }

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Update user data (validate important fields)
    const updates = req.body;
    delete updates.password; // Don't allow password updates through this endpoint
    delete updates.id; // Don't allow ID changes

    users[userIndex] = { ...users[userIndex], ...updates };

    // Return updated user without password
    const { password, ...userResponse } = users[userIndex];
    res.json(userResponse);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
