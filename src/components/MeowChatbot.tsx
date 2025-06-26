import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const MeowChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there, energy seeker! I'm MeowCat, your personal Catrink assistant. Need help finding the perfect energy drink to awaken your inner cat? Meow! 🐱",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = [
    "That's pawsome! Let me help you find the perfect energy boost. Meow!",
    "Purr-fect question! Catrink has amazing flavors that'll make you feel like the cat's whiskers. Meow!",
    "I'm feline good about helping you with that! What specific flavor are you curious about? Meow!",
    "That's claw-some! Our energy drinks are designed to awaken your inner predator instincts. Meow!",
    "Whiskers! I'd be happy to help you with that. What energy level are you looking for today? Meow!",
    "Paw-sitively! Catrink energy drinks are the cat's pajamas for boosting your reflexes. Meow!",
    "That's fur-tastic! I can help you find exactly what you're looking for in our collection. Meow!",
    "Meow-nificent question! Our premium ingredients will have you feeling like a sleek panther. Meow!",
    "I'm not kitten around - that's a great question! Let me share some details with you. Meow!",
    "Claw-some choice! Catrink is purr-fect for anyone wanting to unlock their feline potential. Meow!",
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponses[Math.floor(Math.random() * botResponses.length)],
          isBot: true,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1500,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red",
          "shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300",
          "flex items-center justify-center animate-glow-pulse",
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-red rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 md:w-96 md:h-[500px]"
          >
            <div className="glass-card h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue via-neon-purple to-neon-red flex items-center justify-center animate-float">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-orbitron font-semibold text-white">
                    MeowCat
                  </h3>
                  <p className="text-xs text-neon-cyan">
                    Your Catrink Assistant
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex",
                      message.isBot ? "justify-start" : "justify-end",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-2xl text-sm",
                        message.isBot
                          ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white border border-neon-blue/30"
                          : "bg-gradient-to-r from-neon-purple to-neon-red text-white",
                      )}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                      <p
                        className={cn(
                          "text-xs mt-1 opacity-60",
                          message.isBot ? "text-neon-cyan" : "text-white/60",
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white border border-neon-blue/30 p-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce [animation-delay:0.1s]" />
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask MeowCat anything..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-sm"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                      inputValue.trim() && !isTyping
                        ? "bg-gradient-to-r from-neon-blue to-neon-purple hover:scale-105"
                        : "bg-white/10 cursor-not-allowed",
                    )}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MeowChatbot;
