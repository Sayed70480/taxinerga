"use client";
import { ReactNode, useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IconType } from "react-icons/lib";

interface Props {
  button?: ReactNode;
  icon?: IconType;
  html?: string;
  children?: ReactNode;
  className?: string;
  modalId?: string;
  modalName?: string;
  autoOpen?: boolean;
}

const Modal = ({ button, icon: Icon, html, children, className, modalName, modalId, autoOpen = false }: Props) => {
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(false);

  useEffect(() => {
    if (modalName && modalId) {
      const alreadySeen = modalName ? localStorage.getItem(modalName) === modalId : false;
      if (alreadySeen) {
        setOpen(false);
      } else if (autoOpen) {
        setOpen(true);
      } else if (!alreadySeen && !autoOpen) {
        setNotif(true);
      }
    }
  }, [modalId, modalName, autoOpen]);

  return (
    <>
      {Boolean(button && !modalId) ? (
        button
      ) : (
        <div onClick={() => setOpen(true)} className={`relative cursor-pointer ${className}`}>
          {notif && <div className="animate__animated animate__slow animate__infinite animate__heartBeat absolute -right-1 -top-1 z-10 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">!</div>}
          {Icon && <Icon className="m-auto text-2xl text-white" />}
        </div>
      )}

      {open && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-[1500] flex items-center justify-center backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="border-yellow-700 relative z-[1500] w-full max-w-[96vw] rounded-lg border bg-zinc-900 p-5 lg:max-w-[800px]"
            onClick={(e) => e.stopPropagation()} // ✅ Prevents closing when clicking inside
          >
            <AiOutlineCloseCircle
              onClick={() => {
                setOpen(false);
                setNotif(false)
                if (modalName && modalId) {
                  localStorage.setItem(modalName, modalId);
                }
              }}
              className="absolute right-2 top-2 z-10 cursor-pointer text-2xl text-white"
            />
            <div className="scrollbar mt-5 max-h-[60dvh] overflow-y-auto">
              {html ? (
                <div className="ql-container">
                  <div className="ql-editor" dangerouslySetInnerHTML={{ __html: html }}></div>
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
