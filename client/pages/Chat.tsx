import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  Image,
  File,
  Check,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PlaceholderPage from "@/components/PlaceholderPage";
import NotificationToast from "@/components/NotificationToast";

interface ChatMessage {
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

interface Conversation {
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

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(conversationId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: ChatMessage[] }>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
    setNotification({ message, type, visible: true });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations", {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Use mock data for now since backend returns mock data
        setConversations([
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
            unreadCount: { user_1: 0, prof_1: 2 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      showNotification("Erro ao carregar conversas", "error");
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const response = await fetch(`/api/conversations/${convId}/messages`, {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Use mock data for now
        setMessages((prev) => ({
          ...prev,
          [convId]: [
            {
              id: "msg_1",
              conversationId: convId,
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
              conversationId: convId,
              senderId: "user_1",
              content:
                "Ótimo! Preciso instalar alguns pontos novos na sala e quarto.",
              type: "text",
              status: "read",
              createdAt: new Date(Date.now() - 3300000).toISOString(),
              updatedAt: new Date(Date.now() - 3300000).toISOString(),
            },
            {
              id: "msg_3",
              conversationId: convId,
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
              conversationId: convId,
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
              conversationId: convId,
              senderId: "prof_1",
              content: "Posso começar o serviço amanhã pela manhã.",
              type: "text",
              status: "delivered",
              createdAt: new Date(Date.now() - 1800000).toISOString(),
              updatedAt: new Date(Date.now() - 1800000).toISOString(),
            },
          ],
        }));

        // Mark conversation as read
        await fetch(`/api/conversations/${convId}/read`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.id}`,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      showNotification("Erro ao carregar mensagens", "error");
    }
  };

  const startPolling = () => {
    if (pollIntervalRef.current) return;

    pollIntervalRef.current = setInterval(() => {
      if (selectedConversation) {
        fetchMessages(selectedConversation);
      }
      fetchConversations();
    }, 5000); // Poll every 5 seconds
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    // Always fetch conversations, even for guest users
    fetchConversations();
    setLoading(false);
    startPolling();

    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  // Allow access without authentication - show demo data if no user

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants.find(
      (p) => p.userId !== user?.id,
    );
    return (
      otherParticipant?.userName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (conv.projectTitle &&
        conv.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const currentConversation = conversations.find(
    (conv) => conv.id === selectedConversation,
  );
  const currentMessages = selectedConversation
    ? messages[selectedConversation] || []
    : [];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    const tempMessage = newMessage;
    setNewMessage("");

    try {
      const response = await fetch(
        `/api/conversations/${selectedConversation}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.id}`,
          },
          body: JSON.stringify({
            content: tempMessage,
            type: "text",
          }),
        },
      );

      if (response.ok) {
        // Add message optimistically to UI
        const newMsg: ChatMessage = {
          id: `temp_${Date.now()}`,
          conversationId: selectedConversation,
          senderId: user.id,
          content: tempMessage,
          type: "text",
          status: "sent",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setMessages((prev) => ({
          ...prev,
          [selectedConversation]: [
            ...(prev[selectedConversation] || []),
            newMsg,
          ],
        }));

        // Refresh messages after a short delay
        setTimeout(() => {
          fetchMessages(selectedConversation);
          fetchConversations();
        }, 500);
      } else {
        setNewMessage(tempMessage);
        showNotification("Erro ao enviar mensagem", "error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(tempMessage);
      showNotification("Erro ao enviar mensagem", "error");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAttachment = (type: "image" | "file") => {
    console.log("Attaching:", type);
    setShowAttachments(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex">
      {/* Conversations List */}
      <div
        className={`${
          selectedConversation ? "hidden md:block" : "block"
        } w-full md:w-1/3 bg-white border-r border-border`}
      >
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <Link
                to="/"
                className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth md:hidden"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <h1 className="text-xl title-bold text-foreground">Mensagens</h1>
              <button
                onClick={() => {
                  fetchConversations();
                  if (selectedConversation) fetchMessages(selectedConversation);
                }}
                className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth ml-auto"
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar conversas..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
              />
            </div>
          </div>
        </header>

        {/* Conversations */}
        <div className="p-4 space-y-2">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-4 animate-pulse"
                >
                  <div className="w-12 h-12 bg-secondary rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-secondary rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="body-text text-muted-foreground">
                {searchQuery
                  ? "Nenhuma conversa encontrada"
                  : "Ainda não há conversas"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(
                (p) => p.userId !== user?.id,
              );
              const unreadCount = conversation.unreadCount[user?.id || ""] || 0;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 rounded-xl transition-smooth text-left ${
                    selectedConversation === conversation.id
                      ? "bg-primary/10 border-primary/20"
                      : "hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={otherParticipant?.userAvatar || "/placeholder.svg"}
                        alt={otherParticipant?.userName || "Unknown"}
                        className="w-12 h-12 rounded-xl object-cover bg-secondary"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="subtitle text-sm text-foreground truncate">
                          {otherParticipant?.userName || "Unknown"}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="body-text text-xs text-muted-foreground">
                            {conversation.lastMessage?.createdAt
                              ? formatTime(conversation.lastMessage.createdAt)
                              : ""}
                          </span>
                          {unreadCount > 0 && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {conversation.projectTitle && (
                        <p className="body-text text-xs text-primary mb-1">
                          {conversation.projectTitle}
                        </p>
                      )}

                      <p className="body-text text-xs text-muted-foreground truncate">
                        {conversation.lastMessage?.content ||
                          "Nenhuma mensagem ainda"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div
          className={`${
            selectedConversation ? "block" : "hidden md:block"
          } flex-1 flex flex-col bg-gray-50`}
        >
          {/* Chat Header */}
          <header className="bg-white border-b border-border px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="p-2 hover:bg-secondary rounded-xl transition-smooth md:hidden"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={
                        currentConversation?.participants.find(
                          (p) => p.userId !== user?.id,
                        )?.userAvatar || "/placeholder.svg"
                      }
                      alt={
                        currentConversation?.participants.find(
                          (p) => p.userId !== user?.id,
                        )?.userName || "Unknown"
                      }
                      className="w-10 h-10 rounded-xl object-cover bg-secondary"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                  </div>

                  <div>
                    <h2 className="subtitle text-sm text-foreground">
                      {currentConversation?.participants.find(
                        (p) => p.userId !== user?.id,
                      )?.userName || "Unknown"}
                    </h2>
                    <p className="body-text text-xs text-muted-foreground">
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-secondary rounded-xl transition-smooth">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-xl transition-smooth">
                  <Video className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-xl transition-smooth">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {currentConversation?.projectTitle && (
              <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="body-text text-sm text-primary">
                  📋 Projeto:{" "}
                  <span className="font-semibold">
                    {currentConversation.projectTitle}
                  </span>
                </p>
              </div>
            )}
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((message) => {
              const isOwn = message.senderId === user?.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      isOwn ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isOwn
                          ? "bg-primary text-white rounded-br-md"
                          : "bg-white text-foreground rounded-bl-md shadow-soft"
                      }`}
                    >
                      {message.type === "text" && (
                        <p className="body-text text-sm">{message.content}</p>
                      )}

                      {message.type === "image" && message.attachments && (
                        <div className="space-y-2">
                          <p className="body-text text-sm">{message.content}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {message.attachments.map((attachment, index) => (
                              <img
                                key={index}
                                src={attachment.url}
                                alt={attachment.name}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {message.type === "file" && message.attachments && (
                        <div className="space-y-2">
                          <p className="body-text text-sm">{message.content}</p>
                          {message.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-2 bg-black/10 rounded-lg"
                            >
                              <File className="w-4 h-4" />
                              <span className="body-text text-sm">
                                {attachment.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center space-x-2 mt-1 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="body-text text-xs text-muted-foreground">
                        {formatTime(message.createdAt)}
                      </span>
                      {isOwn && (
                        <div className="flex items-center">
                          {message.status === "sent" && (
                            <Check className="w-3 h-3 text-muted-foreground" />
                          )}
                          {message.status === "delivered" && (
                            <CheckCheck className="w-3 h-3 text-muted-foreground" />
                          )}
                          {message.status === "read" && (
                            <CheckCheck className="w-3 h-3 text-primary" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-border px-4 py-4">
            {showAttachments && (
              <div className="mb-4 p-4 bg-secondary rounded-xl">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAttachment("image")}
                    className="flex items-center justify-center p-4 bg-white rounded-xl hover:bg-gray-50 transition-smooth"
                  >
                    <Image className="w-6 h-6 text-primary mr-2" />
                    <span className="button-text text-sm">Foto</span>
                  </button>
                  <button
                    onClick={() => handleAttachment("file")}
                    className="flex items-center justify-center p-4 bg-white rounded-xl hover:bg-gray-50 transition-smooth"
                  >
                    <File className="w-6 h-6 text-primary mr-2" />
                    <span className="button-text text-sm">Arquivo</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-end space-x-3">
              <button
                onClick={() => setShowAttachments(!showAttachments)}
                className="p-3 bg-secondary rounded-xl hover:bg-muted transition-smooth"
              >
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text resize-none"
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="p-3 gradient-primary text-white rounded-xl hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg title-semibold text-foreground mb-2">
              Selecione uma conversa
            </h3>
            <p className="body-text text-muted-foreground">
              Escolha uma conversa para começar a trocar mensagens
            </p>
          </div>
        </div>
      )}

      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
}
