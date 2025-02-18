"use server";

import { env } from "@/lib/env";
import { FormDataType } from "@/lib/types";
import { createTransport } from "nodemailer";

export const sendEmail = async (fData: FormDataType) => {
  const transporter = createTransport({
    host: env.HOST,
    port: 465,
    secure: true,
    auth: {
      user: env.EMAIL_FROM,
      pass: env.EMAIL_PASS,
    },
  });

  const html = ` 
    <div><strong>Email ID : </strong><span>${fData.email}</span></div>
    <div><strong>Message : </strong><span>${fData.message}</span></div>  
  `;

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: env.EMAIL_TO,
      subject: `Email send by - ${fData.email}`,
      text: `${fData.email}`,
      html: html,
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Error sending email",
    };
  }
};
