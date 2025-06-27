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

  const getIntelligentResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Greetings
    if (
      message.includes("hi") ||
      message.includes("hello") ||
      message.includes("hey")
    ) {
      return "Hello there, energy seeker! I'm MeowCat, your friendly Catrink assistant. I'm here to help you discover the purr-fect energy drink to awaken your inner cat! What can I help you with today? Meow! 🐱";
    }

    // Flavors
    if (
      message.includes("flavor") ||
      message.includes("flavour") ||
      message.includes("taste") ||
      message.includes("mango") ||
      message.includes("bluster")
    ) {
      return "Purr-fect question! Our flagship flavor is Mango Bluster - a tropical thunder that'll unleash your inner jungle cat! We also have Neon Night (dark berry), Arctic Prowl (icy mint), and more exciting flavors. Which one catches your whiskers? Meow!";
    }

    // Energy/Performance
    if (
      message.includes("energy") ||
      message.includes("boost") ||
      message.includes("performance") ||
      message.includes("awaken")
    ) {
      return "That's claw-some! Catrink energy drinks are designed to awaken your inner predator instincts with lightning-fast reflexes and sustained energy. Our formula gives you cat-like agility and focus that lasts for hours! Ready to unleash your potential? Meow!";
    }

    // Ingredients/Health
    if (
      message.includes("ingredient") ||
      message.includes("healthy") ||
      message.includes("safe") ||
      message.includes("natural")
    ) {
      return "Meow-nificent question! Catrink uses only premium natural ingredients like taurine, B-vitamins, natural caffeine, ginseng root, and our proprietary Feline Focus Complex™. All our ingredients are carefully selected to enhance your cat-like performance safely! Meow!";
    }

    // Price/Buy/Shop
    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("buy") ||
      message.includes("shop") ||
      message.includes("order")
    ) {
      return "Paw-sitively affordable! Our energy drinks start at just $4.59, with our premium Mango Bluster at $4.99. You can shop our full collection in our store section - each sip is worth every penny for that cat-like energy boost! Meow!";
    }

    // About company/story
    if (
      message.includes("about") ||
      message.includes("company") ||
      message.includes("story") ||
      message.includes("founded")
    ) {
      return "That's fur-tastic that you're curious! Catrink was born in the neon-lit labs of Neo Tokyo when scientists discovered the secret behind cats' incredible reflexes. We've bottled that feline magic to help humans unlock their inner predator potential! Meow!";
    }

    // Contact/Support
    if (
      message.includes("contact") ||
      message.includes("help") ||
      message.includes("support") ||
      message.includes("problem")
    ) {
      return "I'm feline great about helping you! For detailed support, you can use our contact form or email us directly. I'm here for quick questions, but our human team can handle the bigger stuff. What specific help do you need? Meow!";
    }

    // Shipping/Delivery
    if (
      message.includes("ship") ||
      message.includes("delivery") ||
      message.includes("when") ||
      message.includes("arrive")
    ) {
      return "Whiskers! We ship faster than a cat chasing a laser pointer! Standard delivery takes 3-5 business days, and we offer express shipping for when you need that energy boost ASAP. We deliver worldwide to fellow energy seekers! Meow!";
    }

    // Admin/Login (redirect to proper channels)
    if (
      message.includes("admin") ||
      message.includes("login") ||
      message.includes("account")
    ) {
      return "I'm not kitten around - for account and admin stuff, you'll want to use the login section in the top navigation! I'm just here to chat about our amazing energy drinks and help you find your purr-fect flavor. Meow!";
    }

    // Default responses for general questions
    const defaultResponses = [
      "That's pawsome! Let me help you find the perfect energy boost. What specific question do you have about Catrink? Meow!",
      "I'm feline good about helping you with that! Could you tell me more about what you're looking for? Meow!",
      "Claw-some question! I'd love to help you discover more about Catrink energy drinks. What interests you most? Meow!",
      "Purr-fect! I'm here to help you awaken your inner cat. What would you like to know about our energy drinks? Meow!",
      "That's fur-tastic! I'm your friendly Catrink guide. Ask me about flavors, ingredients, energy levels, or anything else! Meow!",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

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
          text: getIntelligentResponse(userMessage.text),
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
