import { RequestHandler } from "express";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file";
  attachments?: {
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
  status: "sent" | "delivered" | "read";
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    userId: string;
    userName: string;
    userAvatar: string;
    userType: "client" | "professional";
  }[];
  projectId?: string;
  projectTitle?: string;
  lastMessage?: ChatMessage;
  unreadCount: { [userId: string]: number };
  createdAt: string;
  updatedAt: string;
}

// Mock storage - in production, use a real database
let conversations: Conversation[] = [
  {
    id: "conv_1",
    participants: [
      {
        userId: "user_1",
        userName: "João Silva",
        userAvatar: "/placeholder.svg",
        userType: "client",
      },
      {
        userId: "prof_1",
        userName: "Carlos Silva",
        userAvatar: "/placeholder.svg",
        userType: "professional",
      },
    ],
    projectId: "req_1",
    projectTitle: "Instalação Elétrica",
    unreadCount: { user_1: 2, prof_1: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let messages: ChatMessage[] = [
  {
    id: "msg_1",
    conversationId: "conv_1",
    senderId: "prof_1",
    content:
      "Olá! Vi sua solicitação para instalação elétrica. Posso te ajudar com isso.",
    type: "text",
    status: "read",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "msg_2",
    conversationId: "conv_1",
    senderId: "user_1",
    content: "Ótimo! Preciso instalar alguns pontos novos na sala e quarto.",
    type: "text",
    status: "read",
    createdAt: new Date(Date.now() - 3300000).toISOString(),
    updatedAt: new Date(Date.now() - 3300000).toISOString(),
  },
  {
    id: "msg_3",
    conversationId: "conv_1",
    senderId: "prof_1",
    content:
      "Perfeito. Você tem alguma foto do local? Isso me ajuda a dar um orçamento mais preciso.",
    type: "text",
    status: "read",
    createdAt: new Date(Date.now() - 3000000).toISOString(),
    updatedAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: "msg_4",
    conversationId: "conv_1",
    senderId: "user_1",
    content: "Claro! Segue as fotos dos ambientes.",
    type: "image",
    attachments: [
      {
        url: "/placeholder.svg",
        name: "sala.jpg",
        type: "image/jpeg",
        size: 1024000,
      },
      {
        url: "/placeholder.svg",
        name: "quarto.jpg",
        type: "image/jpeg",
        size: 856000,
      },
    ],
    status: "read",
    createdAt: new Date(Date.now() - 2700000).toISOString(),
    updatedAt: new Date(Date.now() - 2700000).toISOString(),
  },
  {
    id: "msg_5",
    conversationId: "conv_1",
    senderId: "prof_1",
    content: "Posso começar o serviço amanhã pela manhã.",
    type: "text",
    status: "delivered",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// GET /api/conversations - Get user conversations
export const handleGetConversations: RequestHandler = (req, res) => {
  const userId = req.headers.authorization?.replace("Bearer ", "") || "user_1"; // Mock auth

  const userConversations = conversations.filter((conv) =>
    conv.participants.some((p) => p.userId === userId),
  );

  // Add last message to each conversation
  const conversationsWithMessages = userConversations.map((conv) => {
    const lastMessage = messages
      .filter((msg) => msg.conversationId === conv.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

    return {
      ...conv,
      lastMessage,
    };
  });

  res.json({
    conversations: conversationsWithMessages,
    total: conversationsWithMessages.length,
  });
};

// GET /api/conversations/:id - Get specific conversation
export const handleGetConversation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const userId = req.headers.authorization?.replace("Bearer ", "") || "user_1"; // Mock auth

  const conversation = conversations.find(
    (conv) =>
      conv.id === id && conv.participants.some((p) => p.userId === userId),
  );

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  res.json(conversation);
};

// POST /api/conversations - Create new conversation
export const handleCreateConversation: RequestHandler = (req, res) => {
  const userId = req.headers.authorization?.replace("Bearer ", "") || "user_1"; // Mock auth
  const { participantId, projectId, projectTitle } = req.body;

  // Check if conversation already exists
  const existingConv = conversations.find(
    (conv) =>
      conv.participants.length === 2 &&
      conv.participants.some((p) => p.userId === userId) &&
      conv.participants.some((p) => p.userId === participantId) &&
      conv.projectId === projectId,
  );

  if (existingConv) {
    return res.json(existingConv);
  }

  // Create new conversation
  const newConversation: Conversation = {
    id: `conv_${Date.now()}`,
    participants: [
      {
        userId,
        userName: "Current User", // In production, get from user profile
        userAvatar: "/placeholder.svg",
        userType: "client",
      },
      {
        userId: participantId,
        userName: "Other User", // In production, get from user profile
        userAvatar: "/placeholder.svg",
        userType: "professional",
      },
    ],
    projectId,
    projectTitle,
    unreadCount: { [userId]: 0, [participantId]: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  conversations.push(newConversation);

  res.status(201).json(newConversation);
};

// GET /api/conversations/:id/messages - Get conversation messages
export const handleGetMessages: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.headers.authorization?.replace("Bearer ", "") || "user_1"; // Mock auth

  // Verify user has access to conversation
  const conversation = conversations.find(
    (conv) =>
      conv.id === id && conv.participants.some((p) => p.userId === userId),
  );

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const conversationMessages = messages
    .filter((msg) => msg.conversationId === id)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const startIndex = (Number(page) - 1) * Number(limit);
  const paginatedMessages = conversationMessages.slice(
    startIndex,
    startIndex + Number(limit),
  );

  res.json({
    messages: paginatedMessages,
    total: conversationMessages.length,
    page: Number(page),
    totalPages: Math.ceil(conversationMessages.length / Number(limit)),
  });
};

// POST /api/conversations/:id/messages - Send message
export const handleSendMessage: RequestHandler = (req, res) => {
  const { id } = req.params;
  const userId = req.headers.authorization?.replace("Bearer ", "") || "user_1"; // Mock auth
  const { content, type = "text", attachments } = req.body;

  // Verify user has access to conversation
  const conversation = conversations.find(
    (conv) =>
      conv.id === id && conv.participants.some((p) => p.userId === userId),
  );

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}`,
    conversationId: id,
    senderId: userId,
    content,
    type,
    attachments,
    status: "sent",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  messages.push(newMessage);

  // Update conversation
  conversation.updatedAt = new Date().toISOString();

  // Update unread count for other participants
  conversation.participants.forEach((participant) => {
    if (participant.userId !== userId) {
      conversation.unreadCount[participant.userId] =
        (conversation.unreadCount[participant.userId] || 0) + 1;
    }
  });

  res.status(201).json(newMessage);
};

// PUT /api/conversations/:id/messages/:messageId - Update message status
export const handleUpdateMessage: RequestHandler = (req, res) => {
  const { id, messageId } = req.params;
  const { status } = req.body;
  const userId = req.headers.authorization?.replace("Bearer ", "") || "user_1"; // Mock auth

  const message = messages.find(
    (msg) => msg.id === messageId && msg.conversationId === id,
  );

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  message.status = status;
  message.updatedAt = new Date().toISOString();

  res.json(message);
};

// PUT /api/conversations/:id/read - Mark conversation as read
export const handleMarkAsRead: RequestHandler = (req, res) => {
  const { id } = req.params;
  const userId = req.headers.authorization?.replace("Bearer ", "") || "user_1"; // Mock auth

  const conversation = conversations.find(
    (conv) =>
      conv.id === id && conv.participants.some((p) => p.userId === userId),
  );

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  // Reset unread count for current user
  conversation.unreadCount[userId] = 0;

  // Mark all messages in conversation as read if they're from other users
  messages
    .filter((msg) => msg.conversationId === id && msg.senderId !== userId)
    .forEach((msg) => {
      if (msg.status !== "read") {
        msg.status = "read";
        msg.updatedAt = new Date().toISOString();
      }
    });

  res.json({ message: "Conversation marked as read" });
};

// DELETE /api/conversations/:id/messages/:messageId - Delete message
export const handleDeleteMessage: RequestHandler = (req, res) => {
  const { id, messageId } = req.params;
  const userId = req.headers.authorization?.replace("Bearer ", "") || "user_1"; // Mock auth

  const messageIndex = messages.findIndex(
    (msg) =>
      msg.id === messageId &&
      msg.conversationId === id &&
      msg.senderId === userId,
  );

  if (messageIndex === -1) {
    return res.status(404).json({ error: "Message not found" });
  }

  messages.splice(messageIndex, 1);

  res.json({ message: "Message deleted successfully" });
};
