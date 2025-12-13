// Utility functions for login keepalive worker

export function parseFormData(urlEncodedString) {
  const params = new URLSearchParams(urlEncodedString)
  const data = {}
  for (const [key, value] of params) {
    data[key] = value
  }
  return data
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
