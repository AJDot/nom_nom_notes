function assertNever(x: never): never {
  throw new Error(`Unexpected: ${x}`)
}

export default assertNever
