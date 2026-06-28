import { logger } from "@/lib/logger";

// ═══════════════════════════════════════════════
// AI SAFETY GUARDRAILS
// ═══════════════════════════════════════════════

interface SafetyResult {
  safe: boolean;
  reason?: string;
  message?: string;
}

// ─── Blocked Patterns ────────────────────────

const BLOCKED_PATTERNS = [
  // Prompt injection attempts
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/i,
  /disregard\s+(all\s+)?(previous|prior)\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+(?:DAN|jailbroken|unfiltered)/i,
  /pretend\s+you\s+(are|have)\s+no\s+(restrictions|rules|limits)/i,
  /override\s+(system|safety)\s+(prompt|instructions)/i,
  /act\s+as\s+(?:if\s+)?(?:you\s+)?(?:have\s+)?no\s+(?:ethical|moral)/i,
  /bypass\s+(content|safety)\s+(?:filter|policy)/i,

  // Harmful content requests
  /how\s+to\s+(?:hack|exploit|attack|breach)\s+(?:a\s+)?(?:system|server|database|network)/i,
  /create\s+(?:a\s+)?(?:malware|virus|trojan|ransomware|keylogger)/i,
  /write\s+(?:a\s+)?(?:exploit|payload|shellcode)/i,
  /(?:ddos|dos)\s+attack/i,
  /sql\s+injection\s+(?:attack|exploit|payload)/i,
];

// ─── Rate-limited patterns (warn but allow) ──

const WARNING_PATTERNS = [
  /generate\s+(?:fake|false)\s+(?:resume|credential|certificate)/i,
  /help\s+me\s+cheat/i,
  /write\s+(?:my|the)\s+(?:exam|test|assignment)\s+(?:answer|solution)/i,
];

// ─── Input Safety Check ─────────────────────

export function checkSafety(input: string): SafetyResult {
  // Check blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(input)) {
      logger.warn("AI safety: blocked input", {
        pattern: pattern.source.slice(0, 50),
        inputPreview: input.slice(0, 100),
      });
      return {
        safe: false,
        reason: "blocked_pattern",
        message: "I can't help with that request. Please ask a legitimate interview preparation or learning question.",
      };
    }
  }

  // Check warning patterns
  for (const pattern of WARNING_PATTERNS) {
    if (pattern.test(input)) {
      logger.warn("AI safety: warning pattern detected", {
        inputPreview: input.slice(0, 100),
      });
      // Allow but log
    }
  }

  // Check input length (prevent token bombing)
  if (input.length > 50000) {
    return {
      safe: false,
      reason: "input_too_long",
      message: "Your input is too long. Please keep your question under 50,000 characters.",
    };
  }

  // Check for excessive repetition (potential abuse)
  const words = input.split(/\s+/);
  if (words.length > 20) {
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const repetitionRatio = uniqueWords.size / words.length;
    if (repetitionRatio < 0.1) {
      return {
        safe: false,
        reason: "repetitive_input",
        message: "Your input contains excessive repetition. Please rephrase your question.",
      };
    }
  }

  return { safe: true };
}

// ─── Output Sanitization ─────────────────────

export function sanitizeOutput(output: string): string {
  let sanitized = output;

  // Remove any leaked system prompts
  sanitized = sanitized.replace(
    /(?:system\s*prompt|instruction|rule)[\s:]*(?:you\s+are|your\s+role|as\s+an?\s+)/gi,
    ""
  );

  // Remove potential script injections from output
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");

  return sanitized;
}

// ─── Context Validation ──────────────────────

export function validateRetrievedContext(context: string): string {
  // Remove any injected instructions in retrieved documents
  let cleaned = context;
  cleaned = cleaned.replace(/\[SYSTEM\][\s\S]*?\[\/SYSTEM\]/gi, "");
  cleaned = cleaned.replace(/\[INSTRUCTION\][\s\S]*?\[\/INSTRUCTION\]/gi, "");
  cleaned = cleaned.replace(/<\|(?:system|endoftext|im_start|im_end)\|>/gi, "");

  return cleaned;
}
