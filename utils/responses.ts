export function errorMessage(error: string, message: string) {
  return {
    isSuccessful: false,
    error,
    message,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function successMessage(message: string, data?: any) {
  return {
    isSuccessful: true,
    message,
    data: data || null,
  };
}
