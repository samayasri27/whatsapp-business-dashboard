"use client";
import Sidebar from "@/components/Sidebar";

import Header from "@/components/Header";
import { Search, Plus, Phone, Video, MoreVertical, Smile, Paperclip, Send, Check, CheckCheck, Image as ImageIcon, FileText, X, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import TemplateParameterModal from "@/components/TemplateParameterModal";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  status: string;
  tags?: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online?: boolean;
}

interface Message {
  id: string;
  phoneNumber: string;
  text: string;
  timestamp: string;
  sent: boolean;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  mediaUrl?: string;
  mediaType?: "image" | "document";
  template?: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  status: string;
  parameters: string[];
}

export default function Chat() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{ title: string; message: string } | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(true);
  const [aiAutoReplyEnabled, setAiAutoReplyEnabled] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [lastProcessedMessageId, setLastProcessedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sort contacts by latest message time
  const sortedContacts = [...contacts].sort((a, b) => {
    const timeA = new Date(a.lastMessageTime || 0).getTime();
    const timeB = new Date(b.lastMessageTime || 0).getTime();
    return timeB - timeA; // Latest first
  });

  // AI Auto-Reply System
  const generateAiResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses for demo
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Thank you for reaching out. How can I assist you today?";
    }
    if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
      return "I'd be happy to help you with pricing information. Let me connect you with our sales team for detailed pricing options.";
    }
    if (message.includes('support') || message.includes('help') || message.includes('issue')) {
      return "I understand you need support. I'm here to help! Could you please describe the issue you're experiencing?";
    }
    if (message.includes('product') || message.includes('service')) {
      return "Great question about our products/services! Let me provide you with some information. What specific aspect would you like to know more about?";
    }
    if (message.includes('thank')) {
      return "You're very welcome! Is there anything else I can help you with today?";
    }
    if (message.includes('bye') || message.includes('goodbye')) {
      return "Thank you for contacting us! Have a great day and feel free to reach out anytime.";
    }
    
    // Default responses
    const defaultResponses = [
      "Thank you for your message! I'm processing your request and will get back to you shortly.",
      "I appreciate you reaching out. Let me look into this for you right away.",
      "Thanks for contacting us! I'm here to help. Could you provide a bit more detail about what you need?",
      "I received your message and I'm working on a response. Thank you for your patience!",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendAiReply = async (originalMessage: string, phoneNumber: string) => {
    if (!aiAutoReplyEnabled) return;
    
    setIsAiTyping(true);
    
    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = generateAiResponse(originalMessage);
      const tempId = `ai-${Date.now()}`;
      
      // Add AI message
      const aiMessage: Message = {
        id: tempId,
        phoneNumber: phoneNumber,
        text: aiResponse,
        timestamp: new Date().toISOString(),
        sent: true,
        status: "sent",
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
      
      // Send to backend
      try {
        const token = await getToken();
        await fetch(`http://localhost:8000/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phone: phoneNumber,
            message: aiResponse,
            isAiReply: true,
          }),
        });
      } catch (error) {
        console.error("Error sending AI reply:", error);
      }
    }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
  };

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Now";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    // Format as date for older messages
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
    fetchTemplates();
  }, []);

  // Fetch messages when contact is selected
  useEffect(() => {
    if (selectedContact?.phone) {
      fetchMessages(selectedContact.phone);
      // Set up polling for real-time updates
      const interval = setInterval(() => {
        fetchMessages(selectedContact.phone);
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContacts = async () => {
    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Use the contacts endpoint instead of users
      const response = await fetch(`http://localhost:8000/contacts`, { headers });

      if (response.ok) {
        const data = await response.json();
        console.log("📱 Fetched contacts for chat:", data.contacts?.length || 0);
        
        // Transform contacts data to include chat-specific fields
        const chatContacts = (data.contacts || []).map((contact: any) => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          avatar: contact.name?.substring(0, 2).toUpperCase() || "??",
          status: contact.status || "Active",
          tags: contact.tags || [],
          lastMessage: "Click to start conversation",
          lastMessageTime: contact.createdAt || new Date().toISOString(),
          unreadCount: Math.floor(Math.random() * 3), // Random for demo
          online: Math.random() > 0.5, // Random online status for demo
        }));
        
        setContacts(chatContacts);
        if (chatContacts.length > 0 && !selectedContact) {
          setSelectedContact(chatContacts[0]);
        }
      } else {
        console.error("Failed to fetch contacts:", response.status);
        // Fallback to sample data for demo
        const sampleContacts = [
          {
            id: "1",
            name: "Sarah Johnson",
            phone: "+1234567890",
            email: "sarah@example.com",
            avatar: "SJ",
            status: "Active",
            tags: ["VIP", "Customer"],
            lastMessage: "Thanks for the quick response!",
            lastMessageTime: new Date(Date.now() - 300000).toISOString(), // 5 min ago
            unreadCount: 2,
            online: true,
          },
          {
            id: "2",
            name: "Mike Chen",
            phone: "+1234567891",
            email: "mike@example.com",
            avatar: "MC",
            status: "Active",
            tags: ["Lead"],
            lastMessage: "I'm interested in your services",
            lastMessageTime: new Date(Date.now() - 900000).toISOString(), // 15 min ago
            unreadCount: 1,
            online: false,
          },
        ];
        setContacts(sampleContacts);
        if (!selectedContact) {
          setSelectedContact(sampleContacts[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (phoneNumber: string) => {
    try {
      const token = await getToken();
      if (!token) {
        console.warn("No auth token available");
        return;
      }

      const response = await fetch(`http://localhost:8000/chats/${encodeURIComponent(phoneNumber)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newMessages = data.messages || [];
        
        // Only trigger AI reply for truly new incoming messages
        if (aiAutoReplyEnabled && lastProcessedMessageId) {
          const newIncomingMessages = newMessages
            .filter((msg: Message) => !msg.sent && msg.id !== lastProcessedMessageId)
            .sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
          // Process only the latest new incoming message
          if (newIncomingMessages.length > 0) {
            const latestMessage = newIncomingMessages[newIncomingMessages.length - 1];
            console.log("🤖 New incoming message detected, triggering AI reply:", latestMessage.text);
            sendAiReply(latestMessage.text, phoneNumber);
            setLastProcessedMessageId(latestMessage.id);
          }
        } else if (newMessages.length > 0) {
          // Set initial last processed message ID
          const lastIncoming = newMessages
            .filter((msg: Message) => !msg.sent)
            .sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          if (lastIncoming) {
            setLastProcessedMessageId(lastIncoming.id);
          }
        }
        
        setMessages(newMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const sendMessage = async () => {
    if ((!messageInput.trim() && !mediaFile) || !selectedContact || sending) return;

    setSending(true);
    const tempId = Date.now().toString();

    // Optimistic update
    const newMessage: Message = {
      id: tempId,
      phoneNumber: selectedContact.phone,
      text: messageInput,
      timestamp: new Date().toISOString(),
      sent: true,
      status: "sending",
      mediaUrl: mediaPreview || undefined,
      mediaType: mediaFile?.type.startsWith("image/") ? "image" : "document",
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
    setMediaFile(null);
    setMediaPreview(null);

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: selectedContact.phone,
          message: messageInput,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update message status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, id: data.messageId, status: "sent" }
              : msg
          )
        );
        toast.success("Message sent!");

        // Simulate delivery and read status updates
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === data.messageId ? { ...msg, status: "delivered" } : msg
            )
          );
        }, 2000);

        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === data.messageId ? { ...msg, status: "read" } : msg
            )
          );
        }, 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Update message status to failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate({
      title: template.name,
      message: template.content,
    });
    setShowTemplates(false);
  };

  const sendTemplateMessage = async (filledMessage: string) => {
    if (!selectedContact) return;

    setMessageInput(filledMessage);
    setSelectedTemplate(null);
    // Auto-send after a brief delay
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const getMessageStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />;
      case "sent":
        return <Check className="w-4 h-4" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      case "failed":
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading chats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Messages" subtitle="Welcome back! Here's what's happening" />

        <div className="flex h-[calc(100vh-80px)]">
          {/* Contacts List */}
          <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold flex-1 dark:text-white">Chats</h2>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  title="Templates"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </button>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Templates Panel */}
            {showTemplates && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-emerald-50 dark:bg-emerald-900/20">
                <h3 className="text-sm font-semibold mb-2 dark:text-white">Quick Templates</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {templates.slice(0, 5).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-sm"
                    >
                      <p className="font-medium dark:text-white">{template.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{template.content}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No contacts found</p>
                </div>
              ) : (
                sortedContacts.filter((contact) =>
                  contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  contact.phone.includes(searchQuery)
                ).map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${selectedContact?.id === contact.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                          {contact.avatar}
                        </div>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{contact.name}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(contact.lastMessageTime || "")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage || "No messages yet"}</p>
                          {contact.unreadCount && contact.unreadCount > 0 && (
                            <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedContact ? (
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedContact.avatar}
                    </div>
                    {selectedContact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{selectedContact.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedContact.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={aiAutoReplyEnabled}
                        onChange={(e) => setAiAutoReplyEnabled(e.target.checked)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-gray-600 dark:text-gray-300">AI Auto-Reply</span>
                    </label>
                    {aiAutoReplyEnabled && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Demo: Simulate incoming message button */}
                  <button
                    onClick={() => {
                      if (!selectedContact) return;
                      const demoMessages = [
                        "Hello, I'm interested in your products",
                        "What are your pricing options?",
                        "I need help with my order",
                        "Thank you for your service",
                        "Can you tell me more about your services?",
                      ];
                      const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
                      const incomingMessage: Message = {
                        id: `demo-${Date.now()}`,
                        phoneNumber: selectedContact.phone,
                        text: randomMessage,
                        timestamp: new Date().toISOString(),
                        sent: false,
                        status: "read",
                      };
                      setMessages(prev => [...prev, incomingMessage]);
                      // Trigger AI reply if enabled
                      if (aiAutoReplyEnabled) {
                        sendAiReply(randomMessage, selectedContact.phone);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-2"
                    title="Simulate incoming message (Demo)"
                  >
                    📱 Demo
                  </button>
                  <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button 
                    onClick={() => setShowContactDetails(!showContactDetails)}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    title={showContactDetails ? "Hide contact details" : "Show contact details"}
                  >
                    {showContactDetails ? (
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-md ${msg.sent ? "order-2" : "order-1"}`}>
                        {msg.mediaUrl && (
                          <div className="mb-2">
                            {msg.mediaType === "image" ? (
                              <img
                                src={msg.mediaUrl}
                                alt="Shared media"
                                className="rounded-lg max-w-full h-auto"
                              />
                            ) : (
                              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <FileText className="w-5 h-5" />
                                <span className="text-sm">Document</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${msg.sent
                            ? "bg-emerald-500 text-white rounded-br-none"
                            : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-sm"
                            }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${msg.sent ? "justify-end" : "justify-start"}`}>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {msg.sent && (
                            <span className="text-white">
                              {getMessageStatusIcon(msg.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* AI Typing Indicator */}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-md">
                      <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {mediaPreview && (
                  <div className="mb-2 relative inline-block">
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="h-20 rounded-lg"
                    />
                    <button
                      onClick={removeMedia}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    title="Use template"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <Smile className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || (!messageInput.trim() && !mediaFile)}
                    className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}

          {/* Contact Info Panel */}
          {selectedContact && showContactDetails && (
            <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-3">
                  {selectedContact.avatar}
                </div>
                <h3 className="font-semibold text-lg dark:text-white">{selectedContact.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedContact.online ? "Online" : "Offline"}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Email</p>
                  <p className="text-sm dark:text-gray-200">{selectedContact.email || "Not provided"}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Phone</p>
                  <p className="text-sm dark:text-gray-200">{selectedContact.phone}</p>
                </div>
                
                {selectedContact.tags && selectedContact.tags.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium mb-3 dark:text-white">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm dark:text-gray-200">Call Contact</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm dark:text-gray-200">Video Call</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm dark:text-gray-200">View Profile</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {selectedTemplate && (
        <TemplateParameterModal
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          template={selectedTemplate}
          onSend={sendTemplateMessage}
        />
      )}
    </div>
  );
}
