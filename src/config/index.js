const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("Missing required environment variable: REACT_APP_API_URL");
}

if (!API_URL.startsWith("/")) {
  try {
    new URL(API_URL);
  } catch {
    throw new Error(`Invalid REACT_APP_API_URL: "${API_URL}"`);
  }
}

export { API_URL };
