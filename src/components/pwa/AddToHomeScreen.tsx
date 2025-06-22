"use client";
import React, { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import ModuleLoading from "./ModuleLoading";
import UseMobileDevice from "./UseMobileDevice";
import useDetectDevice from "@/hooks/useDetectDevice";

const AddToIosSafari = dynamic(() => import("./AddToIosSafari"), { loading: () => <ModuleLoading /> });
const AddToMobileChrome = dynamic(() => import("./AddToMobileChrome"), { loading: () => <ModuleLoading /> });
const AddToMobileFirefox = dynamic(() => import("./AddToMobileFirefox"), { loading: () => <ModuleLoading /> });
const AddToMobileFirefoxIos = dynamic(() => import("./AddToMobileFirefoxIos"), { loading: () => <ModuleLoading /> });
const AddToMobileChromeIos = dynamic(() => import("./AddToMobileChromeIos"), { loading: () => <ModuleLoading /> });
const AddToSamsung = dynamic(() => import("./AddToSamsung"), { loading: () => <ModuleLoading /> });
const AddToOtherBrowser = dynamic(() => import("./AddToOtherBrowser"), { loading: () => <ModuleLoading /> });

type AddToHomeScreenPromptType = "safari" | "chrome" | "firefox" | "other" | "firefoxIos" | "chromeIos" | "samsung" | "notMobile" | "";
const COOKIE_NAME = "addToHomeScreenPrompt";

export default function AddToHomeScreen({ isUserRequest = false, onClose }: { isUserRequest?: boolean; onClose?: () => void }) {
  const [displayPrompt, setDisplayPrompt] = useState<AddToHomeScreenPromptType>("");
  const { userAgent, isMobile, isStandalone, isIOS } = useDetectDevice();

  const closePrompt = () => {
    setDisplayPrompt("");
    if (onClose) {
      onClose();
    }
  };

  const doNotShowAgain = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    setCookie(COOKIE_NAME, "dontShow", { expires: date });
    setDisplayPrompt("");
  };

  useEffect(() => {
    const addToHomeScreenPromptCookie = getCookie(COOKIE_NAME);

    if (addToHomeScreenPromptCookie !== "dontShow" || isUserRequest) {
      if (isMobile && !isStandalone) {
        if (userAgent === "Safari") {
          setDisplayPrompt("safari");
        } else if (userAgent === "Chrome") {
          setDisplayPrompt("chrome");
        } else if (userAgent === "Firefox") {
          setDisplayPrompt("firefox");
        } else if (userAgent === "FirefoxiOS") {
          setDisplayPrompt("firefoxIos");
        } else if (userAgent === "ChromeiOS") {
          setDisplayPrompt("chromeIos");
        } else if (userAgent === "SamsungBrowser") {
          setDisplayPrompt("samsung");
        } else {
          setDisplayPrompt("other");
        }
      } else if (isUserRequest && !isMobile) {
        setDisplayPrompt("notMobile");
      }
    } else {
    }
  }, [userAgent, isMobile, isStandalone, isIOS, isUserRequest]);

  const Prompt = () => (
    <>
      {
        {
          safari: <AddToIosSafari closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
          chrome: <AddToMobileChrome closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
          firefox: <AddToMobileFirefox closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
          firefoxIos: <AddToMobileFirefoxIos closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
          chromeIos: <AddToMobileChromeIos closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
          samsung: <AddToSamsung closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
          other: <AddToOtherBrowser closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
          notMobile: <UseMobileDevice closePrompt={closePrompt} />,
          "": <></>,
        }[displayPrompt]
      }
    </>
  );

  return (
    <>
      {displayPrompt !== "" ? (
        <>
          <div className="fixed z-[999] h-[100dvh] w-[100vw]">
            <Prompt />
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
