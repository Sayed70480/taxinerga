"use client";
import React from "react";
import ReactQuill from "react-quill";

const handleImageInsert = () => {
  const url = prompt("Enter Image URL:");
  if (url) {
    const editor = document.querySelector(".ql-editor");
    if (editor) {
      editor.innerHTML += `<img src="${url}" alt="Inserted Image" class="w-full max-w-[500px] mx-auto" />`;
    }
  }
};

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, false] }], // Headers
      ["bold", "italic", "underline", "strike"], // Text styles
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ align: [] }], // 🔹 Add text alignment tool
      ["link", "image"], // Links & Images
      ["clean"], // Remove formatting
    ],
    handlers: {
      image: handleImageInsert, // Custom Image Handler
    },
  },
};

const RichText = ({ value, setValue }: { value: string; setValue: any }) => {
  return <ReactQuill theme="snow" modules={modules} value={value} onChange={setValue} />;
};

export default RichText;
