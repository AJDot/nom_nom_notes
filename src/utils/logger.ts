/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
class logger {
  warn(message: string) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.warn(message)
    }
  }

  error(message: string) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.error(message)
    }
  }
}

const Logger = new logger()

export default Logger
