/**
 * SecureStorage Utility
 *
 * Provides encrypted storage for sensitive data in localStorage
 * I am using a simple XOR encryption for demonstration purposes
 * In a production environment, I will consider using a more robust encryption library
 */

// Secret key for encryption (in production, I will use an environment variable)
const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET || 'default-secure-key-change-me'

/**
 * Simple XOR encryption/decryption
 * @param text - Text to encrypt/decrypt
 * @param key - Secret key for encryption
 * @returns Encrypted/decrypted string
 */
const xorEncrypt = (text: string, key: string): string => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return btoa(result) // Convert to base64
}

/**
 * Decrypt XOR encrypted string
 * @param encrypted - Encrypted string (base64)
 * @param key - Secret key for decryption
 * @returns Decrypted string
 */
const xorDecrypt = (encrypted: string, key: string): string => {
  try {
    const decoded = atob(encrypted) // Convert from base64
    let result = ''
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return result
  } catch (e) {
    console.error('Failed to decrypt data', e)
    return ''
  }
}

const secureStorage = {
  /**
   * Store data securely in localStorage
   * @param key - Storage key
   * @param value - Value to store
   * @param encrypt - Whether to encrypt the data
   */
  setItem(key: string, value: any, encrypt = true): void {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      const storedValue = encrypt ? xorEncrypt(stringValue, SECRET_KEY) : stringValue
      localStorage.setItem(key, storedValue)
    } catch (e) {
      console.error('Failed to set item in secure storage', e)
    }
  },

  /**
   * Retrieve data from localStorage with optional decryption
   * @param key - Storage key
   * @param decrypt - Whether to decrypt the data
   * @returns Retrieved value or null if not found
   */
  getItem(key: string, decrypt = true): any {
    try {
      const value = localStorage.getItem(key)
      if (!value) return null

      if (decrypt) {
        try {
          const decrypted = xorDecrypt(value, SECRET_KEY)
          if (!decrypted) {
            // Decryption failed, clean up corrupted data
            localStorage.removeItem(key)
            return null
          }

          // Try to parse as JSON if possible
          try {
            return JSON.parse(decrypted)
          } catch (parseError) {
            // Not JSON or invalid JSON, return as is
            return decrypted
          }
        } catch (decryptError) {
          console.error('Decryption error', decryptError)
          // Clean up corrupted data
          localStorage.removeItem(key)
          return null
        }
      }

      return value
    } catch (e) {
      console.error('Failed to get item from secure storage', e)
      // Clean up potentially corrupted data
      localStorage.removeItem(key)
      return null
    }
  },

  /**
   * Remove item from localStorage
   * @param key - Storage key
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Failed to remove item from secure storage', e)
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (e) {
      console.error('Failed to clear secure storage', e)
    }
  },
}

export default secureStorage
