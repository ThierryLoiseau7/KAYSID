/**
 * Logger estruture — pwodui JSON logs ki ka parse pa Vercel, Datadog, etc.
 * Nan development: afiche bèl nan konsòl.
 * Nan production: afiche JSON konplè (pou log aggregation).
 */

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level:     LogLevel;
  message:   string;
  context?:  Record<string, unknown>;
  timestamp: string;
}

const isDev = process.env.NODE_ENV !== "production";

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    ...(context && { context }),
    timestamp: new Date().toISOString(),
  };

  if (isDev) {
    // Lisib nan development
    const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";
    const method = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    method(`${prefix} [${entry.timestamp}] ${message}`, context ?? "");
  } else {
    // JSON brut pou Vercel/production log systems
    const method = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    method(JSON.stringify(entry));
  }
}

export const logger = {
  info:  (msg: string, ctx?: Record<string, unknown>) => log("info",  msg, ctx),
  warn:  (msg: string, ctx?: Record<string, unknown>) => log("warn",  msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log("error", msg, ctx),
};
