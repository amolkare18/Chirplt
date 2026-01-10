import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext.jsx";
import { Send } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const messageData = {
      userId: user.username,
      text: input,
      timestamp: new Date(),
    };

    socket.emit('send-message', messageData);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl h-[600px] bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
          <p className="text-sm text-gray-500 mt-1">Connected</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-gray-400 text-sm">No messages yet</p>
                <p className="text-gray-300 text-xs mt-1">Start a conversation</p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.userId === user.username ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.userId === user.username
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className={`text-xs font-medium mb-1 ${msg.userId === user.username ? 'text-gray-300' : 'text-gray-600'}`}>
                    {msg.userId}
                  </p>
                  <p className="text-sm break-words">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.userId === user.username ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm transition"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Press Enter to send</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;