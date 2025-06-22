"use client";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoGiftSharp } from "react-icons/io5";

const Gift = ({ content }: { content: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Gift Button */}
      <div onClick={() => setOpen(true)} className="col-span-2 ml-auto rounded-full border-[2px] border-white bg-yellow-500 bg-opacity-80 p-3">
        <IoGiftSharp className="animate__animated animate__slow animate__infinite animate__heartBeat m-auto text-2xl text-zinc-900" />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-[899] flex items-center justify-center backdrop-blur-sm"
          onClick={() => setOpen(false)} // ✅ Clicking outside closes modal
        >
          {/* Content Box */}
          <div
            className="relative w-full max-w-[96vw] rounded-lg border border-yellow-700 bg-zinc-900 p-5 lg:max-w-[800px]"
            onClick={(e) => e.stopPropagation()} // ✅ Prevents closing when clicking inside
          >
            <AiOutlineCloseCircle onClick={() => setOpen(false)} className="absolute right-2 top-2 z-10 cursor-pointer text-2xl text-white" />
            <div className="ql-container">
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gift;
