"use server";

import nodemailer, { type SendMailOptions } from "nodemailer";
import { config } from "./config";
import { TInviteMemberRole } from "@/types";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendInviteEmailParams {
  to: string;
  workspaceName: string;
  inviterName: string;
  inviteUrl: string;
  role: TInviteMemberRole;
}

export async function sendInviteEmail({
  to,
  workspaceName,
  inviterName,
  inviteUrl,
  role,
}: SendInviteEmailParams) {
  // In development, log the email instead of sending
  if (process.env.NODE_ENV === "development") {
    console.log("=== INVITE EMAIL (DEV MODE) ===");
    console.log("To:", to);
    console.log("Subject: You've been invited to join", workspaceName);
    console.log("Body:");
    console.log(
      `
        Hi there!

        ${inviterName} has invited you to join "${workspaceName}" as a${role}.

        Click the link below to accept the invitation:
        ${inviteUrl}

        This invitation will expire in 7 days.

        If you didn't expect this invitation, you can safely ignore this email.

        Best,
        The Collaro Team
            `.trim()
    );
    console.log("=== END EMAIL ===");
    return { success: true, data: { messageId: "dev-logged" } };
  }

  try {
    const mailOptions: SendMailOptions = {
      from: config.SMTP_EMAIL_FROM,
      to,
      subject: `You've been invited to join ${workspaceName}`,
      text: `
        Hi there!

        ${inviterName} has invited you to join "${workspaceName}" as a${role === "admin" ? "n admin" : " member"}.

        Click the link below to accept the invitation:
        ${inviteUrl}

        This invitation will expire in 7 days.

        If you didn't expect this invitation, you can safely ignore this email.

        Best,
        The Collaro Team
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Failed to send invite email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
