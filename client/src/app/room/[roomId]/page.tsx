"use client";
import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Chat from "@/app/components/Chat";
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

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://${process.env.NEXT_PUBLIC_TEST_API}/`,
    {
      onOpen: () => {
        console.log("WebSocket connection established!");
      },
      queryParams: {
        roomId: params.roomId,
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
        value={message}
      ></textarea>
      <button className="btn btn-primary max-w-sm" onClick={sendMessageHandler}>
        Send
      </button>
    </div>
  );
}
