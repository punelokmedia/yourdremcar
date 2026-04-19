import { google } from "googleapis";

export const ATS_GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

export function createOAuth2Client() {
  const id = process.env.GOOGLE_CLIENT_ID?.trim();
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirect = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (!id || !secret || !redirect) {
    throw new Error(
      "Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI for ATS Gmail OAuth"
    );
  }
  return new google.auth.OAuth2(id, secret, redirect);
}
