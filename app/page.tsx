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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (messages.length >= 20) { // 10 questions = 20 messages (10 pairs of user+assistant)
      alert('You have reached the maximum number of questions for this conversation.');
      return;
    }

    const newMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const remainingMessages = 20 - messages.length;
  const remainingQuestions = Math.floor(remainingMessages / 2);

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        // Centered layout for initial state with centered input
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
        // Regular layout for conversation with fixed bottom input
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto pb-[80px]">
            <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-500 text-center">
                {remainingQuestions > 0 ? (
                  `${remainingQuestions} questions remaining`
                ) : (
                  'No more questions remaining'
                )}
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
            <div className="max-w-2xl mx-auto w-full px-4 py-4">
              <MessageInput 
                onSend={handleSendMessage}
                disabled={messages.length >= 20 || isLoading}
                disabledMessage={remainingQuestions === 0 ? 'No more questions remaining' : 'Claude is thinking...'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
