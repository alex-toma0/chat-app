"use client";
import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Chat from "@/app/components/Chat";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  message: string;
  isReceived: boolean;
}
export default function Page({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // Combined array
  const clientId = localStorage.getItem("clientId") || uuidv4();
  localStorage.setItem("clientId", clientId);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `wss://${process.env.NEXT_PUBLIC_API_URL}/`,
    {
      onOpen: () => {
        console.log("WebSocket connection established!");
      },
      queryParams: {
        roomId: params.roomId,
        clientId: clientId,
      },
      retryOnError: true,
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
      {messages.length > 0 && <Chat messages={messages} />}

      <textarea
        className="textarea mt-24"
        placeholder="Type a message"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            sendMessageHandler();
          }
        }}
        value={message.trimStart()}
      ></textarea>
      <button
        className="btn btn-primary max-w-sm"
        onClick={sendMessageHandler}
        disabled={readyState !== ReadyState.OPEN}
      >
        Send
      </button>
    </div>
  );
}
