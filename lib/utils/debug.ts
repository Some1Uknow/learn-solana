export function debugLog(module: string, ...args: any[]) {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_LOGS) {
    // eslint-disable-next-line no-console
    console.log(`[${module}]`, ...args);
  }
}
