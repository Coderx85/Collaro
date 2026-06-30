"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInviteEmailParams {
  to: string;
  workspaceName: string;
  inviterName: string;
  inviteUrl: string;
  role: "admin" | "member";
}

export async function sendInviteEmail({
  to,
  workspaceName,
  inviterName,
  inviteUrl,
  role,
}: SendInviteEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Collaro <noreply@collaro.app>",
      to: [to],
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
    });

    if (error) {
      console.error("Failed to send invite email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending invite email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
