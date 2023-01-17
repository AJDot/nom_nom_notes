export const RegexUtils = {
  UUID: /^\h{8}-\h{4}-\h{4}-\h{4}-\h{4}\h{8}$/,
  partial: {
    UUID: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}[0-9a-f]{8}',
  }
}