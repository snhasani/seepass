"use client";

import { cn } from "@/shared/lib/utils";
import { MessageSquare } from "lucide-react";

type ChatStatus = "draft" | "confirmed" | "resolved";

export interface ChatItem {
  id: string;
  title: string;
  updatedAt: number;
  status: ChatStatus;
}

export interface RecentChatsListProps {
  chats: ChatItem[];
  onSelect?: (id: string) => void;
  className?: string;
}

const statusColors: Record<ChatStatus, string> = {
  draft: "bg-amber-400",
  confirmed: "bg-emerald-400",
  resolved: "bg-slate-400",
};

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function ChatRow({
  chat,
  onSelect,
}: {
  chat: ChatItem;
  onSelect?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(chat.id)}
      className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-slate-100"
    >
      <span
        className={cn("size-2 shrink-0 rounded-full", statusColors[chat.status])}
        title={chat.status}
      />
      <span className="flex-1 truncate text-sm text-slate-700">
        {chat.title || "Draft problem"}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatRelativeTime(chat.updatedAt)}
      </span>
    </button>
  );
}

export function RecentChatsList({
  chats,
  onSelect,
  className,
}: RecentChatsListProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-slate-200 bg-white p-4",
        className
      )}
    >
      {chats.length === 0 ? (
        <RecentChatsEmptyState />
      ) : (
        <div className="flex flex-col gap-1">
          {chats.map((chat) => (
            <ChatRow key={chat.id} chat={chat} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export function RecentChatsEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-6 text-center",
        className
      )}
    >
      <MessageSquare className="size-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Start a chat to see it here
      </p>
    </div>
  );
}
