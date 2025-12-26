import { inngest } from "./inngest";
import { sendInviteEmail } from "./nodemailer"; // We'll create this

export const sendInvite = inngest.createFunction(
  { id: "send-invite-email" },
  { event: "app/invite.send" },
  async ({ event, step }) => {
    const { email, workspaceName, inviterName, inviteUrl, role } = event.data;

    await step.run("send-email", async () => {
      return await sendInviteEmail({
        to: email,
        workspaceName,
        inviterName,
        inviteUrl,
        role,
      });
    });

    return { success: true };
  }
);

export const functions = [sendInvite];
