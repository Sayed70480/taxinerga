import { ReactNode } from "react";
import "./globals.css";
import "animate.css";
import "react-quill/dist/quill.snow.css";
import connectMongo from "@/services/mongodb/connectMongo";

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  await connectMongo();

 

  return children;
}
