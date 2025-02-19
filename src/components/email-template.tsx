import * as React from "react";

interface EmailTemplateProps {
  email: string;
  code: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  code,
}: EmailTemplateProps) => (
  <div>
    <h1>Welcome, {email}!</h1>
    <p>
      {" "}
      Your verify code is {code}. Please copy and paste it on verification page
    </p>
  </div>
);
