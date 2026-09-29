"use client";

import { useRef, useState, useEffect, useCallback, FormEvent } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  Send,
  User,
  Loader2,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Scale,
  Filter,
  ExternalLink,
  X,
  Info,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Star,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { VoiceMicButton } from "@/components/ui/VoiceMicButton";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { synthesizeSpeech } from "@/lib/voice-api";
import { playBrowserSpeech, stopBrowserSpeech } from "@/lib/speech";
import { CitationBadge } from "@/components/chat/CitationBadge";
import { SourcesList } from "@/components/chat/SourcesList";
import { parseMessageWithCitations } from "@/lib/parse-citations";
import { MeridasIcon } from "@/components/brand/MeridasLogo";

interface ClaimEvaluation {
  claim: string;
  passageId: string;
  passageText: string;
  documentTitle?: string;
  relationship: "SUPPORTS" | "CONTRADICTS" | "NEUTRAL";
  score: number;
  rationale: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  decisionState?: "SUPPORTED" | "CONDITIONAL" | "CANNOT_ESTABLISH";
  missingEvidenceGap?: string;
  evaluations?: ClaimEvaluation[];
  context?: Array<{
    vectorId: string;
    score: number;
    text: string;
    metadata?: {
      documentId?: string;
      documentTitle?: string;
      chunkIndex?: number;
    };
  }>;
  conversationId?: string;
  createdAt: string;
  isStreaming?: boolean;
  isError?: boolean;
}

interface ConversationListItem {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

interface ConversationMessagesResponse {
  conversation: { id: string; title: string | null; createdAt: string };
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
  }>;
}

export default function ChatPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const api = useApi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"answer" | "summary" | "exact">("answer");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);

  const stopAudioPlayback = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    stopBrowserSpeech();
    if (cancelSpeechRef.current) {
      cancelSpeechRef.current();
      cancelSpeechRef.current = null;
    }
    setPlayingMessageId(null);
  }, []);

  useEffect(() => {
    return () => {
      stopAudioPlayback();
    };
  }, [stopAudioPlayback]);

  const handleToggleAudio = useCallback(
    async (msgId: string, content: string) => {
      if (playingMessageId === msgId) {
        stopAudioPlayback();
        return;
      }

      stopAudioPlayback();
      setPlayingMessageId(msgId);

      const cleanText = content
        .replace(/\[\^?\d+\]/g, "")
        .replace(/[*#`_~]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .trim();

      try {
        const token = await getToken();
        if (token) {
          try {
            const blob = await synthesizeSpeech(cleanText.slice(0, 4000), token);
            if (blob && blob.size > 200 && blob.type.includes("audio")) {
              const url = URL.createObjectURL(blob);
              const audio = new Audio(url);
              activeAudioRef.current = audio;
              audio.onended = () => {
                setPlayingMessageId(null);
                URL.revokeObjectURL(url);
              };
              audio.onerror = () => {
                cancelSpeechRef.current = playBrowserSpeech(
                  cleanText,
                  () => setPlayingMessageId(null),
                  () => setPlayingMessageId(null)
                );
              };
              await audio.play();
              return;
            }
          } catch {
            // Server TTS unavailable or key missing -> fall through to browser speech
          }
        }

        cancelSpeechRef.current = playBrowserSpeech(
          cleanText,
          () => setPlayingMessageId(null),
          () => setPlayingMessageId(null)
        );
      } catch {
        setPlayingMessageId(null);
      }
    },
    [playingMessageId, getToken, stopAudioPlayback]
  );

  const handleCopyText = useCallback(async (msgId: string, content: string) => {
    try {
      const cleanText = content.replace(/\[\^?\d+\]/g, "").trim();
      await navigator.clipboard.writeText(cleanText);
      setCopiedMessageId(msgId);
      window.setTimeout(() => setCopiedMessageId(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }, []);

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Operational Scoping
  const [selectedSite, setSelectedSite] = useState<string>("All");
  const [selectedSystem, setSelectedSystem] = useState<string>("All");
  const [selectedClaim, setSelectedClaim] = useState<ClaimEvaluation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    state: voiceState,
    start: startVoice,
    stop: stopVoice,
    error: voiceError,
    secondsRemaining,
    transcript,
  } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const fetchConversations = async () => {
    try {
      const res = await api.get<ConversationListItem[]>("/chat/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await api.get<any[]>("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchDocuments();
  }, []);

  const loadConversation = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await api.get<ConversationMessagesResponse>(
        `/chat/conversations/${id}/messages`
      );
      setMessages(
        res.data.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        }))
      );
      setConversationId(id);
    } catch (err) {
      setError("Failed to load conversation history.");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
  };

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && !isStreaming) {
      inputRef.current?.focus();
    }
  }, [isLoading, isStreaming]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        440,
        audioContext.currentTime + 0.15
      );

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.15
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
      // Ignore audio errors
    }
  };

  const executeSend = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading || isStreaming) return;

    setError(null);

    // Apply Scope Filter Context if active
    let contextualMessage = trimmed;
    if (selectedSite !== "All" || selectedSystem !== "All") {
      const scopeTag = `[Operational Scope: Site=${selectedSite}, System=${selectedSystem}]`;
      if (!trimmed.includes("[Operational Scope:")) {
        contextualMessage = `${scopeTag} ${trimmed}`;
      }
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        context: [],
        createdAt: new Date().toISOString(),
        isStreaming: true,
      },
    ]);

    setIsStreaming(true);
    setIsLoading(false);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication failed");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: contextualMessage,
            conversationId,
            mode,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          const data = await response.json().catch(() => ({}));
          const retryAfter = data?.retryAfter ?? 60;
          throw new Error(`Rate limited. Try again in ${retryAfter} seconds.`);
        }
        throw new Error(response.statusText || "Request failed");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to read response");
      }

      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const event = buffer.substring(0, boundary).trim();
          buffer = buffer.substring(boundary + 2);

          if (event.startsWith("data: ")) {
            try {
              const data = JSON.parse(event.slice(6));

              if (data.type === "token") {
                if (!fullContent) {
                  playNotificationSound();
                }
                fullContent += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                );
                setAutoScroll(true);
              }

              if (data.type === "done") {
                setConversationId(data.conversationId);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? {
                          ...msg,
                          content: fullContent,
                          context: data.context,
                          decisionState: data.decisionState || "SUPPORTED",
                          missingEvidenceGap: data.missingEvidenceGap,
                          evaluations: data.evaluations || [],
                          conversationId: data.conversationId,
                          isStreaming: false,
                        }
                      : msg
                  )
                );
                setIsStreaming(false);
                fetchConversations();
              }

              if (data.type === "error") {
                const isRateLimit =
                  data.message?.toLowerCase().includes("rate limit") ||
                  data.message?.toLowerCase().includes("busy") ||
                  data.message?.toLowerCase().includes("429") ||
                  data.message?.toLowerCase().includes("capacity");
                const displayMsg = isRateLimit
                  ? "The AI is currently processing many requests. Please wait about 10 seconds and try again."
                  : "Something went wrong. Please try again.";

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? {
                          ...msg,
                          content: displayMsg,
                          isStreaming: false,
                          isError: true,
                        }
                      : msg
                  )
                );
                setIsStreaming(false);
                setError(data.message || "Stream error");
              }
            } catch (parseErr) {
              console.error("Failed to parse SSE message:", parseErr);
            }
          }
          boundary = buffer.indexOf("\n\n");
        }
      }
    } catch (err: any) {
      console.error("Stream error:", err);
      const isRateLimit =
        err.message?.toLowerCase().includes("rate limit") ||
        err.message?.toLowerCase().includes("busy") ||
        err.message?.toLowerCase().includes("429") ||
        err.message?.toLowerCase().includes("capacity");
      const displayMsg = isRateLimit
        ? "The AI is currently at capacity. Please take a 10-second break and try again!"
        : err.message || "Something went wrong. Please try again.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: displayMsg,
                isStreaming: false,
                isError: true,
              }
            : msg
        )
      );
      setIsStreaming(false);
      setError(displayMsg);
    }

    inputRef.current?.focus();
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    await executeSend(input);
  };

  const retryMessage = async (messageContent: string) => {
    setMessages((prev) => prev.filter((msg) => !msg.isError));
    await executeSend(messageContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as unknown as FormEvent);
    }
  };

  const pilotQueries = [
    {
      badge: "VPN & MFA",
      title: "Active VPN Port & Login Method",
      query: "What is the active port and login verification method for the company VPN?",
      description: "Checks active Duo push requirements against legacy settings.",
    },
    {
      badge: "Equipment Loan",
      title: "15-Day Equipment Borrowing Rule",
      query: "Can an employee keep loaner equipment for 21 days without checking into the central warehouse?",
      description: "Checks equipment loan requests against the 15-day return and check-in policy.",
    },
    {
      badge: "Server Operations",
      title: "Server Decommission Sign-Off",
      query: "What approvals are required to permanently decommission and sanitize a company server?",
      description: "Checks required dual-manager approvals before taking servers offline.",
    },
    {
      badge: "Security Access",
      title: "Regional Gateway Security Token",
      query: "What security tokens and network parameters are required for regional gateway access?",
      description: "Checks regional login rules and security token requirements.",
    },
  ];

  return (
    <div className="flex flex-1 h-full min-h-0 relative overflow-hidden bg-[#151417] text-[#F7F3EA] font-sans">
      {/* History Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-white/10 bg-[#151417]/95 backdrop-blur-xl transition-all duration-300 relative z-10",
          isHistoryOpen ? "w-72 opacity-100" : "w-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-white/10 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
              Chat History
            </span>
          </div>
          <button
            onClick={startNewChat}
            className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#9E1B32] text-[#F7F3EA] hover:bg-[#BA243F] border border-[#C9A227]/40 transition-colors shadow-sm"
            title="New Inquiry"
          >
            <Plus size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 chat-scrollbar font-sans">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => loadConversation(conv.id)}
              className={cn(
                "w-full text-left rounded-[10px] p-3 transition-all group relative font-sans",
                conversationId === conv.id
                  ? "bg-[#9E1B32]/20 border-l-2 border-[#C9A227] text-[#F7F3EA] shadow-sm"
                  : "text-[#8C8A94] hover:bg-[#1C1B20] hover:text-[#F7F3EA]"
              )}
            >
              <div className="text-xs font-medium truncate pr-2 text-[#F7F3EA]">
                {conv.title || conv.lastMessage?.substring(0, 42) || "Inquiry Session"}
              </div>
              <div className="font-sans text-[11px] text-[#C9A227]/80 mt-1">
                {new Date(conv.createdAt).toLocaleDateString()} · {conv.messageCount || 1} msgs
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="text-center py-12 text-xs text-[#8C8A94] italic px-4 font-sans">
              Prior inquiries will appear here.
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-h-0 relative bg-[#151417] font-sans">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="absolute left-4 top-3.5 z-30 flex size-8 items-center justify-center rounded-[8px] border border-white/10 bg-[#1C1B20]/80 backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-[#8C8A94] hover:text-[#F7F3EA] shadow-sm"
          title={isHistoryOpen ? "Hide history" : "Show history"}
        >
          {isHistoryOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Scoping Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#1C1B20]/60 px-14 py-2.5 backdrop-blur-md font-sans">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#C9A227]">
              <Filter className="size-3.5" />
              <span className="font-sans text-xs font-semibold text-[#C9A227]">
                Filter Scope:
              </span>
            </div>

            {/* Site Scope */}
            <div className="flex items-center gap-1">
              <span className="font-sans text-xs text-[#8C8A94] mr-1">
                Location:
              </span>
              {["All", "HQ", "Regional East", "Remote"].map((site) => (
                <button
                  key={site}
                  onClick={() => setSelectedSite(site)}
                  className={cn(
                    "rounded-[6px] px-2.5 py-1 text-xs font-sans font-medium transition-all",
                    selectedSite === site
                      ? "bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/40 shadow-sm font-semibold"
                      : "bg-[#151417] text-[#8C8A94] border border-white/5 hover:text-[#F7F3EA] hover:border-white/20"
                  )}
                >
                  {site}
                </button>
              ))}
            </div>

            <div className="h-3 w-px bg-white/10 hidden sm:block" />

            {/* System Scope */}
            <div className="flex items-center gap-1">
              <span className="font-sans text-xs text-[#8C8A94] mr-1">
                Category:
              </span>
              {["All", "IT & Security", "Equipment & Devices", "Operations"].map(
                (sys) => (
                  <button
                    key={sys}
                    onClick={() => setSelectedSystem(sys)}
                    className={cn(
                      "rounded-[6px] px-2.5 py-1 text-xs font-sans font-medium transition-all",
                      selectedSystem === sys
                        ? "bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/40 shadow-sm font-semibold"
                        : "bg-[#151417] text-[#8C8A94] border border-white/5 hover:text-[#F7F3EA] hover:border-white/20"
                    )}
                  >
                    {sys}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* AI Notice Banner */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#1C1B20]/90 px-6 sm:px-14 py-2 text-xs text-[#8C8A94] font-sans shrink-0">
          <div className="flex items-center gap-2">
            <Star className="size-3 fill-[#C9A227] text-[#C9A227]" />
            <span>You are chatting with an AI assistant.</span>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto p-6 pb-28 scroll-smooth chat-scrollbar font-sans"
        >
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center gap-6 text-center max-w-3xl mx-auto py-8">
              <div className="group relative flex size-20 items-center justify-center rounded-[20px] border border-[#C9A227]/30 bg-[#1C1B20] shadow-2xl shadow-black/80">
                <MeridasIcon size={52} />
              </div>

              <div className="space-y-2 max-w-lg">
                <h3 className="text-2xl font-bold tracking-tight text-[#F7F3EA] font-sans">
                  Meridas assistant
                </h3>
                <p className="font-sans text-xs text-[#C9A227] tracking-wide font-medium">
                  Evidence first. Answer second.
                </p>
                <p className="text-sm text-[#8C8A94] leading-relaxed pt-1 font-sans">
                  Ask any question about company policies, standard operating procedures, and runbooks. Every answer is checked against official documentation and clearly cited.
                </p>
              </div>

              {/* Pilot Inquiry Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full pt-4 font-sans">
                {pilotQueries.map((pq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInput(pq.query);
                      executeSend(pq.query);
                    }}
                    className="group flex flex-col text-left p-4 rounded-[14px] bg-[#1C1B20]/80 hover:bg-[#1C1B20] border border-white/10 hover:border-[#C9A227]/50 shadow-md hover:shadow-xl transition-all duration-200 font-sans"
                  >
                    <div className="flex items-center justify-between w-full mb-1.5 font-sans">
                      <span className="font-sans text-[11px] font-semibold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded-[4px] border border-[#C9A227]/20">
                        {pq.badge}
                      </span>
                      <span className="font-sans text-xs text-[#8C8A94] group-hover:text-[#F7F3EA] transition-colors">
                        Ask →
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-[#F7F3EA] group-hover:text-[#C9A227] transition-colors line-clamp-1 mb-1 font-sans">
                      {pq.title}
                    </h4>
                    <p className="text-[12px] text-[#8C8A94] leading-relaxed line-clamp-2 font-sans">
                      {pq.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 py-6 font-sans">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3.5 group font-sans",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {/* Assistant Avatar */}
                  {msg.role === "assistant" && (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-[#C9A227]/40 bg-[#1C1B20] shadow-sm">
                      <MeridasIcon size={20} />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "max-w-[88%] rounded-[14px] px-5 py-4 text-sm leading-relaxed transition-all font-sans",
                      msg.role === "user"
                        ? "bg-[#9E1B32]/20 text-[#F7F3EA] border border-[#9E1B32]/50 shadow-lg shadow-[#9E1B32]/10"
                        : "bg-[#1C1B20] border border-white/10 text-[#F7F3EA] shadow-xl"
                    )}
                  >
                    {/* Decision State Banner for Assistant Messages */}
                    {msg.role === "assistant" && !msg.isStreaming && msg.decisionState && (
                      <div className="mb-4 font-sans">
                        {msg.decisionState === "SUPPORTED" && (
                          <div className="rounded-[10px] border border-[#C9A227]/40 bg-[#C9A227]/10 p-3 flex items-start gap-2.5">
                            <CheckCircle2 className="size-4 text-[#C9A227] shrink-0 mt-0.5" />
                            <div>
                              <div className="font-sans text-xs font-semibold text-[#C9A227]">
                                Verified by Official Documents
                              </div>
                              <div className="text-xs text-[#F7F3EA]/90 mt-0.5 font-sans">
                                All points in this answer are directly backed by active company documentation.
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.decisionState === "CONDITIONAL" && (
                          <div className="rounded-[10px] border border-amber-500/40 bg-amber-500/10 p-3 flex items-start gap-2.5">
                            <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-sans text-xs font-semibold text-amber-400">
                                Conditional Policy
                              </div>
                              <div className="text-xs text-[#F7F3EA]/90 mt-0.5 font-sans">
                                Directives apply specifically within designated sites, systems, or criteria.
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.decisionState === "CANNOT_ESTABLISH" && (
                          <div className="rounded-[10px] border border-[#9E1B32] bg-[#9E1B32]/20 p-3.5 flex flex-col gap-2 font-sans">
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="size-4 text-red-400 shrink-0" />
                              <span className="font-sans text-xs font-semibold text-red-400">
                                Information Not Found in Documents
                              </span>
                            </div>
                            <div className="text-xs text-[#F7F3EA]/90 font-sans">
                              {msg.missingEvidenceGap ||
                                "Official documents do not contain enough verified evidence, or conflicting policies were found."}
                            </div>
                            <Link
                              href="/dashboard/conflicts"
                              className="inline-flex items-center gap-1.5 text-xs text-[#C9A227] hover:underline font-sans mt-1 font-medium"
                            >
                              <Scale className="size-3.5" />
                              Review Policy Conflicts →
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Display */}
                    <div className="text-[14px] leading-relaxed overflow-hidden font-sans">
                      {msg.role === "assistant" && !msg.content && msg.isStreaming ? (
                        <div className="flex items-center gap-2 py-1">
                          <div className="flex gap-1">
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-[bounce_1s_infinite]"
                              style={{ animationDelay: "0ms" }}
                            />
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-[bounce_1s_infinite]"
                              style={{ animationDelay: "150ms" }}
                            />
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-[bounce_1s_infinite]"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                          <span className="font-sans text-xs font-semibold text-[#C9A227]">
                            Checking Policy Documents...
                          </span>
                        </div>
                      ) : (
                        <>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-4 last:mb-0 whitespace-pre-wrap">
                                  {children}
                                </p>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold text-[#F7F3EA]">
                                  {children}
                                </strong>
                              ),
                              code: ({ children }) => (
                                <code className="bg-[#151417] text-[#C9A227] rounded-[4px] px-1.5 py-0.5 font-mono text-[12px] border border-white/5">
                                  {children}
                                </code>
                              ),
                              text: ({ children }) => {
                                if (
                                  typeof children === "string" &&
                                  msg.role === "assistant"
                                ) {
                                  const segments = parseMessageWithCitations(
                                    children,
                                    msg.context as any
                                  );
                                  return (
                                    <>
                                      {segments.map((seg, i) => {
                                        if (seg.type === "citation") {
                                          return (
                                            <CitationBadge
                                              key={`citation-${i}`}
                                              index={seg.index}
                                              item={seg.item as any}
                                              onClick={(idx) =>
                                                setHighlightedIndex(idx)
                                              }
                                            />
                                          );
                                        }
                                        return (
                                          <span key={`text-${i}`}>
                                            {seg.content}
                                          </span>
                                        );
                                      })}
                                    </>
                                  );
                                }
                                return children;
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>

                          {msg.isStreaming && (
                            <span className="inline-block w-0.5 h-[1.2em] bg-[#C9A227] animate-[blink_0.7s_infinite] ml-1 align-middle" />
                          )}
                        </>
                      )}
                    </div>

                    {/* Statement Verification Drawer */}
                    {msg.role === "assistant" &&
                      !msg.isStreaming &&
                      msg.evaluations &&
                      msg.evaluations.length > 0 && (
                        <div className="mt-5 pt-3.5 border-t border-white/10 font-sans">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="font-sans text-xs font-semibold text-[#8C8A94] flex items-center gap-1.5">
                              <Info className="size-3 text-[#C9A227]" />
                              Statement Verification ({msg.evaluations.length})
                            </span>
                            <span className="font-sans text-xs text-[#8C8A94]">
                              Click any statement to see source citation
                            </span>
                          </div>
                          <div className="flex flex-col gap-1.5 font-sans">
                            {msg.evaluations.map((ev, i) => {
                              const isSupports = ev.relationship === "SUPPORTS";
                              const isContradicts = ev.relationship === "CONTRADICTS";
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setSelectedClaim(ev)}
                                  className={cn(
                                    "flex items-center justify-between text-left p-2.5 rounded-[8px] border text-xs transition-all font-sans",
                                    isSupports &&
                                      "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-200",
                                    isContradicts &&
                                      "bg-red-500/10 border-red-500/40 hover:bg-red-500/15 text-red-200",
                                    !isSupports &&
                                      !isContradicts &&
                                      "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 text-amber-200"
                                  )}
                                >
                                  <div className="flex-1 min-w-0 pr-3">
                                    <span className="line-clamp-1 font-sans">
                                      &ldquo;{ev.claim}&rdquo;
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={cn(
                                        "font-sans text-[11px] font-semibold px-2 py-0.5 rounded-[4px] uppercase",
                                        isSupports && "bg-emerald-500/20 text-emerald-300",
                                        isContradicts && "bg-red-500/30 text-red-300",
                                        !isSupports && !isContradicts && "bg-amber-500/20 text-amber-300"
                                      )}
                                    >
                                      {ev.relationship}
                                    </span>
                                    <span className="font-sans text-xs text-[#8C8A94]">
                                      {Math.round(ev.score * 100)}%
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    {/* Sources Section */}
                    {msg.role === "assistant" &&
                      !msg.isStreaming &&
                      msg.context &&
                      msg.context.length > 0 && (
                        <div className="animate-[fadeIn_0.3s_ease-out_0.2s_forwards]">
                          <SourcesList
                            context={msg.context as any}
                            highlightedIndex={highlightedIndex}
                          />
                        </div>
                      )}

                    {/* Assistant Message Actions: Listen, Copy */}
                    {msg.role === "assistant" && !msg.isStreaming && (
                      <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-2.5 font-sans">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleAudio(msg.id, msg.content)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-xs font-sans font-medium transition-all",
                              playingMessageId === msg.id
                                ? "bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40 shadow-sm"
                                : "bg-[#151417] text-[#8C8A94] border border-white/10 hover:text-[#F7F3EA] hover:border-white/20"
                            )}
                            title={playingMessageId === msg.id ? "Stop Listening" : "Listen to Response"}
                          >
                            {playingMessageId === msg.id ? (
                              <>
                                <VolumeX size={13} className="text-[#C9A227] animate-pulse" />
                                <span className="font-semibold text-[#C9A227]">Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={13} className="text-[#8C8A94]" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#151417] border border-white/10 px-2.5 py-1 text-xs font-sans text-[#8C8A94] hover:text-[#F7F3EA] hover:border-white/20 transition-all font-medium"
                            title="Copy Response"
                          >
                            {copiedMessageId === msg.id ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-300">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <span className="font-sans text-[11px] text-[#8C8A94]/70">
                          Verified Response
                        </span>
                      </div>
                    )}

                    {/* Error Retry */}
                    {msg.isError && (
                      <button
                        type="button"
                        onClick={() => retryMessage(msg.content)}
                        className="mt-3 font-sans text-xs text-red-400 hover:text-[#F7F3EA] transition-colors"
                      >
                        ↺ Retry inquiry
                      </button>
                    )}
                  </div>

                  {/* User Avatar */}
                  {msg.role === "user" && (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#1C1B20] border border-[#C9A227]/40 shadow-sm overflow-hidden">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName || "Operator"}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="size-4 text-[#C9A227]" />
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Banner */}
        <div className="relative font-sans">
          <div
            className={cn(
              "absolute bottom-0 left-1/2 flex w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 items-center gap-2 rounded-[10px] border border-red-500/40 bg-[#1C1B20] px-4 py-3 text-sm text-red-400 shadow-xl backdrop-blur-md transition-all duration-300 z-40 font-sans",
              error
                ? "translate-y-[-1rem] opacity-100"
                : "translate-y-4 opacity-0 pointer-events-none"
            )}
          >
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            <span className="flex-1 font-sans text-xs">
              {error}
            </span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 text-red-400 transition-colors hover:text-[#F7F3EA]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-white/10 bg-[#1C1B20] p-4 font-sans">
          <form
            onSubmit={sendMessage}
            className="mx-auto flex max-w-3xl items-end gap-3 font-sans"
          >
            <div className="relative flex-1">
              <div className="mb-2 flex gap-2 font-sans">
                {[
                  { value: "answer", label: "Detailed Answer" },
                  { value: "summary", label: "Summary" },
                  { value: "exact", label: "Exact Policy Excerpt" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMode(option.value as typeof mode)}
                    className={cn(
                      "rounded-[6px] border px-3 py-1 font-sans text-xs font-medium transition-all",
                      mode === option.value
                        ? "border-[#C9A227]/50 bg-[#C9A227]/15 text-[#C9A227] shadow-sm font-semibold"
                        : "border-white/10 bg-[#151417] text-[#8C8A94] hover:border-white/20 hover:text-[#F7F3EA]"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about policies, procedures, or guidelines..."
                rows={1}
                className="w-full resize-none rounded-[10px] border border-white/10 bg-[#151417] px-4 py-3 pr-12 text-sm text-[#F7F3EA] placeholder:text-[#8C8A94] focus:border-[#C9A227]/60 focus:outline-none transition-all font-sans"
                disabled={isStreaming}
                style={{ minHeight: "44px", maxHeight: "200px" }}
              />
              {voiceError && (
                <div className="absolute -bottom-6 left-0 font-sans text-xs text-red-400">
                  {voiceError}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <VoiceMicButton
                state={voiceState}
                onStart={startVoice}
                onStop={stopVoice}
                secondsRemaining={secondsRemaining}
                size={44}
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#9E1B32] text-[#F7F3EA] hover:bg-[#BA243F] border border-[#C9A227]/40 shadow-md shadow-[#9E1B32]/30 transition-all active:scale-95 disabled:opacity-30"
              >
                {isStreaming ? (
                  <Loader2 className="size-5 animate-spin text-[#C9A227]" />
                ) : (
                  <Send className="size-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-lg rounded-[16px] border border-[#C9A227]/40 bg-[#1C1B20] p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-sans text-xs font-semibold px-2 py-0.5 rounded-[4px] uppercase",
                    selectedClaim.relationship === "SUPPORTS" &&
                      "bg-emerald-500/20 text-emerald-300",
                    selectedClaim.relationship === "CONTRADICTS" &&
                      "bg-red-500/30 text-red-300",
                    selectedClaim.relationship === "NEUTRAL" &&
                      "bg-amber-500/20 text-amber-300"
                  )}
                >
                  {selectedClaim.relationship}
                </span>
                <span className="font-sans text-xs font-medium text-[#C9A227]">
                  Confidence: {Math.round(selectedClaim.score * 100)}%
                </span>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="text-[#8C8A94] hover:text-[#F7F3EA] transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div>
              <label className="font-sans text-xs font-semibold text-[#8C8A94] block mb-1">
                Statement
              </label>
              <p className="text-sm font-medium text-[#F7F3EA] bg-[#151417] p-3 rounded-[8px] border border-white/5 font-sans">
                &ldquo;{selectedClaim.claim}&rdquo;
              </p>
            </div>

            <div>
              <label className="font-sans text-xs font-semibold text-[#8C8A94] block mb-1">
                Source Document Quote
              </label>
              <p className="text-xs text-[#F7F3EA]/90 bg-[#151417] p-3 rounded-[8px] border border-white/5 font-sans leading-relaxed">
                {selectedClaim.passageText}
              </p>
            </div>

            <div>
              <label className="font-sans text-xs font-semibold text-[#8C8A94] block mb-1">
                Verification Explanation
              </label>
              <p className="text-xs text-[#C9A227] leading-relaxed font-sans">
                {selectedClaim.rationale}
              </p>
            </div>

            <div className="pt-2 flex justify-end font-sans">
              <button
                onClick={() => setSelectedClaim(null)}
                className="rounded-[8px] bg-[#151417] hover:bg-[#151417]/80 border border-white/10 px-4 py-2 font-sans text-xs font-medium text-[#F7F3EA] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
