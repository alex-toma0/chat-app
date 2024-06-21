import { Message } from "@/app/room/[roomId]/page";

export default function Chat({ messages }: { messages: Message[] }) {
  return (
    <div className="chat-container">
      {messages.map((messageObj) => (
        <div
          className={`chat ${
            messageObj.isReceived ? "chat-start" : "chat-end"
          }`}
          key={messageObj.message + (messageObj.message.length - 3)}
        >
          <div
            className={`chat-bubble ${
              messageObj.isReceived ? "" : "chat-bubble-primary"
            }`}
          >
            {messageObj.message}
          </div>
        </div>
      ))}
    </div>
  );
}
