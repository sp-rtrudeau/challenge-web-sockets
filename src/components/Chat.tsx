'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  type: 'message' | 'announcement';
}

interface ChatProps {
  username: string;
}

export default function Chat({ username }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const wsUrl = 'ws://localhost:3001';
    
    // Create a new WebSocket connection
    const newSocket = new WebSocket(wsUrl);
    
    // Handle connection open
    newSocket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
      
      // Send join message to register username with the server
      const joinMessage = {
        type: 'join',
        username: username
      };
      newSocket.send(JSON.stringify(joinMessage));
      console.log(joinMessage);
    };
    
    // Handle connection close
    newSocket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };
    
    // Handle connection errors
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    // Handle incoming messages
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different message types from server
        let processedMessage: Message;
        
        if (data.type === 'userJoined') {
          processedMessage = {
            id: Date.now(),
            username: 'System',
            message: `${data.username} has joined the chat`,
            timestamp: new Date().toISOString(),
            type: 'announcement'
          };
        } else if (data.type === 'userLeft') {
          processedMessage = {
            id: Date.now(),
            username: 'System',
            message: `${data.username} has left the chat`,
            timestamp: new Date().toISOString(),
            type: 'announcement'
          };
        } else {
          // Regular message or announcement
          processedMessage = {
            id: data.id || Date.now(),
            username: data.username || 'Unknown',
            message: data.message || '',
            timestamp: data.timestamp || new Date().toISOString(),
            type: data.type || 'message'
          };
        }
        
        setMessages(prev => [...prev, processedMessage]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    
    // Store the socket in state
    setSocket(newSocket);
    
    // Cleanup function to close the connection when component unmounts
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [username]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    
    // Create message object
    const messageData = {
      id: Date.now(),
      username: username,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'message' as const
    };
    
    // Send message through WebSocket
    socket.send(JSON.stringify(messageData));
    
    // Clear the input field
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold">Chat Room</h1>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          <span>•</span>
          <span>Logged in as: {username}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.type === 'announcement'
                  ? 'bg-gray-200 text-gray-600 text-center mx-auto'
                  : msg.username === username
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              {msg.type === 'message' && msg.username !== username && (
                <div className="text-xs text-gray-500 mb-1">{msg.username}</div>
              )}
              <div className="text-sm">{msg.message}</div>
              <div className={`text-xs mt-1 ${
                msg.username === username ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 