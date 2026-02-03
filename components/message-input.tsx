'use client';

import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export function MessageInput({ onSend, disabled, disabledMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end" style={{ alignItems: 'normal' }}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? disabledMessage : "Ask me anything..."}
          className="w-full resize-none overflow-hidden rounded-xl border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          rows={1}
          disabled={disabled}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
} 