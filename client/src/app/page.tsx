"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const [roomId, setRoomId] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);
  const handleCreateRoom = () => {
    setRoomId(uuidv4());
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center gap-5">
      <span>Get started by creating a chat room!</span>

      <button className="btn btn-primary" onClick={handleCreateRoom}>
        Create room
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box flex flex-col">
          <h3 className="font-bold text-lg">Your room has been created! </h3>
          <span>Share the room link and start chatting!</span>
          <Link href={`/room/${roomId}`}>
            <span className="link text-warning">{`${window.location}/room/${roomId}`}</span>
          </Link>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
