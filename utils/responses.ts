export function errorMessage(error: string, message: string) {
  return {
    isSuccessful: false,
    error,
    message,
  };
}
