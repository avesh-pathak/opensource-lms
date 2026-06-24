type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error | unknown
}

class Logger {
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: unknown
  ) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    }

    if (error instanceof Error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    } else if (error) {
      entry.error = error
    }

    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry))
    } else {
      // Pretty print in development
      const color =
        level === 'error'
          ? '\x1b[31m' // Red
          : level === 'warn'
            ? '\x1b[33m' // Yellow
            : level === 'info'
              ? '\x1b[36m' // Cyan
              : '\x1b[90m' // Gray

      console.log(
        `${color}[${level.toUpperCase()}]\x1b[0m ${message}`,
        context || '',
        error || ''
      )
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: unknown, context?: Record<string, any>) {
    this.log('error', message, context, error)
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, context)
    }
  }
}

export const logger = new Logger()
