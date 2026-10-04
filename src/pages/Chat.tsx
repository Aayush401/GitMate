import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ArrowLeft,
  Loader2,
  Send,
  MessageCircle,
} from "lucide-react";

import api from "@/lib/axios";

import { AppLayout } from "@/components/layout/AppLayout";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Textarea } from "@/components/ui/textarea";

import { useAuth } from "@/contexts/AuthContext";

/*
 * =========================
 * TYPES
 * =========================
 */

interface User {
  id: string;
  name: string;
  image: string | null;
}

interface Participant {
  userId: string;
  user: User;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface ChatResponse {
  id: string;

  participants: Participant[];

  messages: Message[];

  createdAt?: string;
  updatedAt?: string;
}

/*
 * =========================
 * HELPERS
 * =========================
 */

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

/*
 * =========================
 * CHAT
 * =========================
 */

const Chat = () => {
  /*
   * URL:
   *
   * /chat/:id
   *
   * id = the OTHER USER'S id
   */

  const { id } = useParams<{
    id: string;
  }>();

  const { isAuthenticated } = useAuth();

  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * =========================
   * CURRENT USER
   * =========================
   *
   * We don't touch AuthContext.
   *
   * We simply call /auth/me.
   */

  const {
    data: meData,
    isLoading: meLoading,
    isError: meError,
  } = useQuery({
    queryKey: ["auth-me"],

    queryFn: async () => {
      const response = await api.get("/auth/me");

      return response.data;
    },

    enabled: isAuthenticated === true,
  });

  const currentUserId =
    meData?.user?.id;

  /*
   * =========================
   * CHAT QUERY
   * =========================
   */

  const {
    data: chat,
    isLoading: chatLoading,
    isError: chatError,
  } = useQuery<ChatResponse>({
    queryKey: ["chat", id],

    queryFn: async () => {
      const response = await api.get(
        `/chat/${id}`,
      );

      return response.data;
    },

    enabled: Boolean(
      id && currentUserId,
    ),

    /*
     * Poll every 2 seconds.
     *
     * This allows the other user to send
     * a message and have it appear here.
     */

    refetchInterval: 2000,

    refetchIntervalInBackground: true,
  });

  /*
   * =========================
   * RECEIVER / OTHER USER
   * =========================
   *
   * Your backend returns:
   *
   * participants: [
   *   {
   *     userId,
   *     user: {
   *       id,
   *       name,
   *       image
   *     }
   *   }
   * ]
   *
   * We find the participant who is NOT
   * the currently authenticated user.
   */

  const otherParticipant =
    chat?.participants?.find(
      (participant) =>
        participant.userId !== currentUserId,
    );

  const otherUser =
    otherParticipant?.user ?? null;

  /*
   * =========================
   * SEND MESSAGE
   * =========================
   */

  const sendMessageMutation =
    useMutation({
      mutationFn: async (
        content: string,
      ) => {
        if (!id) {
          throw new Error(
            "No user id provided",
          );
        }

        const response =
          await api.post(
            `/chat/${id}/messages`,
            {
              content,
            },
          );

        return response.data;
      },

      onSuccess: () => {
        /*
         * Immediately fetch the latest
         * messages after sending.
         */

        queryClient.invalidateQueries({
          queryKey: ["chat", id],
        });
      },
    });

  /*
   * =========================
   * AUTO SCROLL
   * =========================
   */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages]);

  /*
   * =========================
   * SEND
   * =========================
   */

  const handleSend = async (
    event?: FormEvent,
  ) => {
    event?.preventDefault();

    const trimmed =
      message.trim();

    if (
      !trimmed ||
      !id ||
      sendMessageMutation.isPending
    ) {
      return;
    }

    /*
     * Clear immediately so the UI feels
     * responsive.
     */

    setMessage("");

    try {
      await sendMessageMutation.mutateAsync(
        trimmed,
      );
    } catch {
      /*
       * Restore message if request fails.
       */

      setMessage(trimmed);
    }
  };

  /*
   * =========================
   * KEYBOARD
   * =========================
   */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    /*
     * Enter = send
     *
     * Shift + Enter = newline
     */

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };

  /*
   * =========================
   * LOADING AUTH
   * =========================
   */

  if (
    meLoading ||
    !currentUserId
  ) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * AUTH ERROR
   * =========================
   */

  if (meError) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />

          <h2 className="text-lg font-semibold">
            Authentication required
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            We couldn't determine the current user.
          </p>
        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * NO USER ID
   * =========================
   */

  if (!id) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />

          <h2 className="text-lg font-semibold">
            No conversation selected
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            Select a user to start chatting.
          </p>
        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * CHAT LOADING
   * =========================
   */

  if (chatLoading) {
    return (
      <AppLayout>
        <div className="h-[calc(100vh-120px)] flex flex-col">

          {/* HEADER SKELETON */}

          <div className="bg-card border border-border/50 rounded-t-2xl px-5 py-4">
            <div className="flex items-center gap-3 animate-pulse">

              <div className="w-9 h-9 rounded-lg bg-muted" />

              <div className="w-11 h-11 rounded-full bg-muted" />

              <div className="space-y-2">
                <div className="w-32 h-4 rounded bg-muted" />

                <div className="w-20 h-3 rounded bg-muted" />
              </div>

            </div>
          </div>

          {/* MESSAGE SKELETON */}

          <div className="flex-1 bg-card border-x border-border/50 p-6 space-y-5 overflow-hidden">

            <div className="flex justify-start">
              <div className="w-48 h-12 rounded-2xl bg-muted animate-pulse" />
            </div>

            <div className="flex justify-end">
              <div className="w-64 h-12 rounded-2xl bg-muted animate-pulse" />
            </div>

            <div className="flex justify-start">
              <div className="w-56 h-16 rounded-2xl bg-muted animate-pulse" />
            </div>

            <div className="flex justify-end">
              <div className="w-40 h-12 rounded-2xl bg-muted animate-pulse" />
            </div>

          </div>

          {/* INPUT SKELETON */}

          <div className="bg-card border border-border/50 rounded-b-2xl p-4">
            <div className="h-12 bg-muted rounded-xl animate-pulse" />
          </div>

        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * CHAT ERROR
   * =========================
   */

  if (
    chatError ||
    !chat
  ) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center">

          <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />

          <h2 className="text-lg font-semibold">
            Unable to load chat
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            We couldn't load this conversation.
          </p>

        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * RECEIVER ERROR
   * =========================
   */

  if (!otherUser) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center">

          <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />

          <h2 className="text-lg font-semibold">
            User not found
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            This conversation doesn't have another participant.
          </p>

        </div>
      </AppLayout>
    );
  }

  /*
   * =========================
   * PAGE
   * =========================
   */

  return (
    <AppLayout>

      <div className="h-[calc(100vh-120px)] flex flex-col min-h-0">

        {/* ============================== */}
        {/* CHAT HEADER */}
        {/* ============================== */}

        <div className="bg-card border border-border/50 rounded-t-2xl px-5 py-4">

          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                window.history.back()
              }
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <Avatar className="w-11 h-11">

              <AvatarImage
                src={
                  otherUser.image ??
                  undefined
                }
                alt={otherUser.name}
              />

              <AvatarFallback>
                {getInitials(
                  otherUser.name,
                )}
              </AvatarFallback>

            </Avatar>

            <div className="min-w-0">

              <h2 className="font-semibold text-foreground truncate">
                {otherUser.name}
              </h2>

              <p className="text-xs text-muted-foreground">
                Conversation
              </p>

            </div>

          </div>

        </div>

        {/* ============================== */}
        {/* MESSAGES */}
        {/* ============================== */}

        <div className="flex-1 min-h-0 overflow-y-auto bg-card border-x border-border/50 px-5 py-6">

          {chat.messages.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center text-center">

              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-semibold text-foreground">
                Start the conversation
              </h3>

              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Send a message to{" "}
                {otherUser.name}{" "}
                to get started.
              </p>

            </div>

          ) : (

            <div className="space-y-3 max-w-4xl mx-auto">

              {chat.messages.map(
                (msg) => {

                  const isMine =
                    msg.senderId ===
                    currentUserId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`max-w-[75%] sm:max-w-[65%] ${
                          isMine
                            ? "items-end"
                            : "items-start"
                        } flex flex-col`}
                      >

                        <div
                          className={`
                            px-4 py-2.5
                            rounded-2xl
                            text-sm
                            break-words
                            whitespace-pre-wrap
                            ${
                              isMine
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            }
                          `}
                        >
                          {msg.content}
                        </div>

                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {formatTime(
                            msg.createdAt,
                          )}
                        </span>

                      </div>

                    </div>
                  );
                },
              )}

              <div
                ref={messagesEndRef}
              />

            </div>

          )}

        </div>

        {/* ============================== */}
        {/* COMPOSER */}
        {/* ============================== */}

        <div className="bg-card border border-border/50 rounded-b-2xl p-4">

          <form
            onSubmit={handleSend}
            className="max-w-4xl mx-auto"
          >

            <div className="flex items-end gap-3">

              <Textarea
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value,
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder={`Message ${otherUser.name}...`}
                className="min-h-[48px] max-h-32 resize-none"
                disabled={
                  sendMessageMutation.isPending
                }
                rows={1}
              />

              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 shrink-0"
                disabled={
                  !message.trim() ||
                  sendMessageMutation.isPending
                }
              >

                {sendMessageMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}

              </Button>

            </div>

            <p className="text-[11px] text-muted-foreground mt-2 px-1">
              Press Enter to send · Shift + Enter for a new line
            </p>

          </form>

        </div>

      </div>

    </AppLayout>
  );
};

export default Chat;
