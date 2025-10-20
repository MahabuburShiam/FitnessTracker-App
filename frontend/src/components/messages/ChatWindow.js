import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as messageApi from '../../api/messages';

const ChatWindow = ({ recipient, onMessageSent }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!recipient) return;
      setLoading(true);
      try {
        const conversation = await messageApi.getConversationWithUser(recipient.id, token);
        setMessages(conversation.messages || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [recipient, token]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const newMessage = await messageApi.sendMessage(recipient.id, content, token);
      setMessages(prev => [...prev, newMessage]);
      setContent('');
      if (onMessageSent) onMessageSent();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!recipient) {
    return <div className="flex items-center justify-center h-full text-gray-500">Select a conversation to start chatting.</div>;
  }

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b font-bold text-lg">Chat with {recipient.name}</div>
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex mb-3 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg py-2 px-4 max-w-sm ${msg.senderId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t flex">
        <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="Type a message..." className="flex-grow p-2 border rounded-l-md" />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;