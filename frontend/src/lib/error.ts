import axios from "axios";

export function getErrorMessage(error: unknown, defaultMessage = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.error || error.response?.data?.message;
    if (backendMessage && typeof backendMessage === "string") {
      return backendMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return defaultMessage;
}
