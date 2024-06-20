"use client";
import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:8080/",
    {
      onOpen: () => {
        console.log("WebSocket connection established!");
      },
    }
  );

  useEffect(() => {
    if (lastMessage != null) {
      setMessages([...messages, lastMessage.data]);
    }
  }, [lastMessage]);

  const sendMessageHandler = useCallback(() => sendMessage(message), []);
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="chat chat-start">
        {messages.length > 0 &&
          messages.map((message) => (
            <div className="chat-bubble" key={message + (message.length - 3)}>
              {message}
            </div>
          ))}
      </div>
      <textarea
        className="textarea"
        placeholder="Type a message"
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button className="btn btn-primary max-w-sm" onClick={sendMessageHandler}>
        Send
      </button>
    </div>
  );
}
