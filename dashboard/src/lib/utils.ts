import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Egyptian phone number utilities
export function formatPhoneNumberInput(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Handle different input scenarios
  if (digits.length === 0) return "";

  // If starts with 20 (country code), remove it
  if (digits.startsWith("20")) {
    return digits.substring(2);
  }

  // If starts with 01, keep as is
  if (digits.startsWith("01")) {
    return digits.substring(0, 11); // Limit to 11 digits
  }

  // If starts with 1 (without 0), add 0
  if (digits.startsWith("1")) {
    return "0" + digits.substring(0, 10); // 0 + 10 digits = 11 total
  }

  // If starts with other digits, assume it should start with 01
  if (digits.length > 0 && !digits.startsWith("0")) {
    return "01" + digits.substring(0, 9); // 01 + 9 digits = 11 total
  }

  return digits.substring(0, 11); // Limit to 11 digits
}

export function isValidEgyptianPhone(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Egyptian mobile numbers: 01XXXXXXXXX (11 digits)
  // Valid prefixes: 010, 011, 012, 015
  const egyptianMobileRegex = /^01[0125]\d{8}$/;

  return egyptianMobileRegex.test(digits);
}
