import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email: string, code: string): Promise<any> => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Verify your email address",
      react: EmailTemplate({ email, code }),
    });
    return { message: "Email send successfully", success: true };
  } catch (emailError) {
    console.log("Failed to send email " + emailError);
    return { message: "Failed to send Email", success: false };
  }
};
