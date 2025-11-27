import crypto from "crypto";

export function generateApiKey() {
  return crypto.randomBytes(32).toString("hex"); // 64-char
}

export function generateApiToken() {
  return crypto.randomBytes(48).toString("hex"); // 96-char
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}
