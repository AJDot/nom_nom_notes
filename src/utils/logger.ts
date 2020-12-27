class logger {
  warn(message: string) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message)
    }
  }
}

const Logger = new logger()

export default Logger
