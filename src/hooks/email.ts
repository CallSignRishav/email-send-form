"use server";

import { adminTemplate, receiptTemplate } from "@/lib/email-templates";
import { serverEnv } from "@/lib/env";
import type { FormDataType } from "@/lib/types";
import nodemailer from "nodemailer";

// Gmail App Password – uses well-known service "gmail" (smtp.gmail.com:465 secure:true)
// https://nodemailer.com/guides/using-gmail#app-password-requires-2-step-verification
// https://nodemailer.com/smtp/well-known-services

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: serverEnv.EMAIL_FROM,
    pass: serverEnv.EMAIL_PASS, // 16-char App Password (2-Step Verification required, spaces stripped by zod)
  },
});

export const sendEmail = async (fData: FormDataType) => {
  const admin = adminTemplate({
    fullName: fData.fullName,
    email: fData.email,
    mobile: fData.mobile,
    subject: fData.subject,
    message: fData.message,
  });
  const receipt = receiptTemplate({
    fullName: fData.fullName,
    email: fData.email,
    mobile: fData.mobile,
    subject: fData.subject,
    message: fData.message,
  });

  try {
    await transporter.sendMail({
      from: serverEnv.EMAIL_FROM,
      to: serverEnv.EMAIL_TO,
      replyTo: fData.email,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
    });

    await transporter.sendMail({
      from: serverEnv.EMAIL_FROM,
      to: fData.email,
      replyTo: serverEnv.EMAIL_TO,
      subject: receipt.subject,
      text: receipt.text,
      html: receipt.html,
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("sendEmail failed:", error);
    return {
      success: false,
      message: "Error sending email",
    };
  }
};
