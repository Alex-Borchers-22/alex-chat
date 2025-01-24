'use client';

import { useState } from 'react';
import { Message, type Role } from '@/components/message';
import { MessageInput } from '@/components/message-input';

interface ChatMessage {
  role: Role;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = async (content: string) => {
    if (messages.length >= 10) { // 5 questions = 10 messages (5 pairs of user+assistant)
      alert('You have reached the maximum number of questions for this conversation.');
      return;
    }

    const newMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: ChatMessage = { role: 'assistant', content: data.response };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get response. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {messages.length === 0 ? (
        // Centered layout for initial state
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">Chat with Alex</h1>
            <p className="text-xl text-gray-500">
              👋 Hi! I'm Alex's AI assistant. Ask me anything about his work experience, 
              background, or interests!
            </p>
          </div>
          <div className="w-full mt-8">
            <MessageInput 
              onSend={handleSendMessage}
              disabled={false}
            />
          </div>
        </div>
      ) : (
        // Regular layout for conversation
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
            </div>
          </div>
          <div className="flex-none border-t bg-background">
            <div className="max-w-2xl mx-auto w-full px-4 py-4">
              <MessageInput 
                onSend={handleSendMessage}
                disabled={messages.length >= 10}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
