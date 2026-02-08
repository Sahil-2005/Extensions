// A dictionary of regex patterns to look for
const SENSITIVE_PATTERNS = [
  {
    name: "Email",
    // Simple email regex
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: "[EMAIL_REDACTED]"
  },
  {
    name: "IPv4 Address",
    // Improved IPv4 validation (0-255 for each octet)
    regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacement: "[IP_REDACTED]"
  },
  {
    name: "API Key - OpenAI",
    regex: /\bsk-[a-zA-Z0-9]{48}\b/g,
    replacement: "[OPENAI_KEY_REDACTED]"
  },
  {
    name: "API Key - AWS Access Key",
    regex: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
    replacement: "[AWS_KEY_REDACTED]"
  },
  {
    name: "API Key - Google",
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/g,
    replacement: "[GOOGLE_KEY_REDACTED]"
  },
  {
    name: "API Key - Generic",
    // Looks for common API key patterns
    regex: /\b(?:api[_-]?key|apikey|access[_-]?token|secret[_-]?key)[\s:=]+['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
    replacement: "[API_KEY_REDACTED]"
  },
  {
    name: "JWT Token",
    regex: /\beyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\b/g,
    replacement: "[JWT_TOKEN_REDACTED]"
  },
  {
    name: "Credit Card",
    // Matches common credit card formats (Visa, MC, Amex, Discover)
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    replacement: "[CREDIT_CARD_REDACTED]"
  },
  {
    name: "SSN (US)",
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: "[SSN_REDACTED]"
  },
  {
    name: "Phone Number (US)",
    regex: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
    replacement: "[PHONE_REDACTED]"
  },
  {
    name: "Private Key",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    replacement: "[PRIVATE_KEY_REDACTED]"
  },
  {
    name: "GitHub Token",
    regex: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/g,
    replacement: "[GITHUB_TOKEN_REDACTED]"
  },
  {
    name: "Database Connection String",
    regex: /\b(?:mongodb|mysql|postgresql|postgres):\/\/[^\s]+/gi,
    replacement: "[DB_CONNECTION_REDACTED]"
  },
  {
    name: "AWS Secret Access Key",
    regex: /\b[A-Za-z0-9/+=]{40}\b/g,
    replacement: "[AWS_SECRET_REDACTED]"
  }
];
