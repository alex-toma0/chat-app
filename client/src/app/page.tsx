"use client";
import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
interface Message {
  message: string;
  isReceived: boolean;
}
export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // Combined array

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
      // Add new message with a flag to identify sender
      setMessages([
        ...messages,
        { message: lastMessage.data, isReceived: true },
      ]);
    }
  }, [lastMessage]);

  const sendMessageHandler = () => {
    sendMessage(message);
    setMessages([...messages, { message, isReceived: false }]); // Sent message with flag
    setMessage("");
  };

  return (
    <div className="h-full flex flex-col justify-center items-center gap-5">
      {messages.length > 0 && (
        <div className="chat-container">
          {messages.map((messageObj) => (
            <div
              className={`chat ${
                messageObj.isReceived ? "chat-start" : "chat-end"
              }`}
            >
              <div
                className="chat-bubble"
                key={messageObj.message + (messageObj.message.length - 3)}
              >
                {messageObj.message}
              </div>
            </div>
          ))}
        </div>
      )}

      <textarea
        className="textarea mt-24"
        placeholder="Type a message"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            sendMessageHandler();
          }
        }}
        value={message}
      ></textarea>
      <button className="btn btn-primary max-w-sm" onClick={sendMessageHandler}>
        Send
      </button>
    </div>
  );
}
