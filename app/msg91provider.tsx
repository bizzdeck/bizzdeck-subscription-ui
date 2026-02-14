"use client";

import Script from "next/script";

export default function Msg91OtpProvider() {
  const configuration = {
    widgetId: "3661646c4d6f303431333132",
    tokenAuth: "478315TIhnk9u8D0695a611eP1",
    exposeMethods: true,
    captchaRenderId: "",
    success: (data: any) => {
      console.log("OTP success", data);
    },
    failure: (error: any) => {
      console.log("OTP failure", error);
    },
  };

  const handleScriptLoad = () => {
    if ((window as any).initSendOTP) {
      (window as any).initSendOTP(configuration);
    }
  };

  return (
    <Script
      src="https://verify.msg91.com/otp-provider.js"
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
    />
  );
}
