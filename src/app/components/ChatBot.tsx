"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "1",
        text: "Hello! I'm your LuxRide assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const suggestedQuestions = [
    "How do I book a ride?",
    "What are your pricing rates?",
    "How can I cancel my booking?",
    "What vehicles do you have?",
    "Do you operate 24/7?",
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes("book") || message.includes("reserve")) {
      return 'To book a ride, simply click on "Book a Ride" in your dashboard. You\'ll need to enter your pickup location, destination, preferred date and time. Our system will calculate the route and show you real-time pricing. You can also add stops and special requests!';
    }

    if (
      message.includes("pricing") ||
      message.includes("cost") ||
      message.includes("rate")
    ) {
      return "Our pricing is based on real-time route calculation:\n• Base fare: $50\n• Distance: $3 per mile\n• Time: $0.50 per minute\n• Vehicle rates vary by type\n\nWe calculate exact costs based on the actual driving route using Google Maps, so you get fair and accurate pricing!";
    }

    if (message.includes("cancel") || message.includes("modify")) {
      return 'You can cancel or modify your booking from "My Trips" in your dashboard. Cancellations are free up to 2 hours before your scheduled pickup time. For modifications like adding stops or extending time, the system will recalculate pricing automatically.';
    }

    if (
      message.includes("vehicle") ||
      message.includes("car") ||
      message.includes("fleet")
    ) {
      return "We offer three premium vehicle categories:\n• Luxury Sedan (Mercedes S-Class): Up to 3 passengers\n• Premium SUV (Cadillac Escalade): Up to 6 passengers\n• Executive Van (Mercedes Sprinter): Up to 12 passengers\n\nAll vehicles feature leather seats, climate control, Wi-Fi, and complimentary refreshments!";
    }

    if (
      message.includes("time") ||
      message.includes("hours") ||
      message.includes("24/7")
    ) {
      return "Yes! LuxRide operates 24/7, 365 days a year. You can book rides for immediate pickup or schedule them in advance. Our professional chauffeurs are available around the clock to provide premium service whenever you need it.";
    }

    if (message.includes("driver") || message.includes("chauffeur")) {
      return "Our chauffeurs are professionally trained, licensed, and background-checked. They maintain high customer ratings and undergo regular safety training. You can view your assigned driver's details and contact them directly once your booking is confirmed.";
    }

    if (message.includes("payment") || message.includes("pay")) {
      return "We accept all major credit cards, Apple Pay, and Google Pay. Payment is processed securely through Stripe. You'll receive detailed receipts via email, and you can add tips for your chauffeur directly in the app after your trip.";
    }

    if (
      message.includes("area") ||
      message.includes("location") ||
      message.includes("service")
    ) {
      return "We currently serve the greater New York metropolitan area, including all five boroughs, nearby airports (JFK, LGA, EWR), and surrounding counties. Our service area is expanding - contact us if you need service to a specific location!";
    }

    if (message.includes("help") || message.includes("support")) {
      return "I'm here to help! You can also reach our customer support team at:\n• Phone: (555) 123-LUXE\n• Email: support@luxride.com\n• Live chat: Available 24/7 in your dashboard\n\nIs there anything specific I can help you with?";
    }

    // Default response
    return "Thank you for your question! I can help you with booking rides, pricing information, vehicle details, cancellations, and general service questions. You can also contact our support team at (555) 123-LUXE for personalized assistance. What would you like to know more about?";
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center ${
          isOpen ? "rotate-45" : "hover:scale-105"
        }`}
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-xl">💬</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-black text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">LuxRide Assistant</h3>
                <p className="text-xs text-gray-300">Online now</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-black p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm text-black"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim()}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
