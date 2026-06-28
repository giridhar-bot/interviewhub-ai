type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

function createEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
  };
}

export const logger = {
  info(message: string, data?: unknown) {
    const entry = createEntry("info", message, data);
    console.log(JSON.stringify(entry));
  },
  warn(message: string, data?: unknown) {
    const entry = createEntry("warn", message, data);
    console.warn(JSON.stringify(entry));
  },
  error(message: string, data?: unknown) {
    const entry = createEntry("error", message, data);
    console.error(JSON.stringify(entry));
  },
  debug(message: string, data?: unknown) {
    if (process.env.NODE_ENV === "development") {
      const entry = createEntry("debug", message, data);
      console.debug(JSON.stringify(entry));
    }
  },
};
