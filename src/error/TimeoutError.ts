class TimeoutError extends Error {
  constructor() {
    super('Request timed out')
  }

  get name(): string {
    return this.constructor.name
  }
}

export { TimeoutError }
