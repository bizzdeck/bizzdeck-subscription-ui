/**
 * API Service for handling all fetch requests
 */

interface FetchOptions {
  headers?: Record<string, string>
}

interface PostFetchOptions extends FetchOptions {
  payload: Record<string, any>
}

/**
 * GET Fetch Request
 * @param url - The URL endpoint
 * @param options - Options including headers
 * @returns Promise with parsed JSON response
 */
export const getFetch = async (
  url: string,
  options?: FetchOptions
): Promise<any> => {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const headers = {
      ...defaultHeaders,
      ...(options?.headers || {}),
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      data,
      status: response.status,
    }
  } catch (error) {
    console.error('GET Fetch Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    }
  }
}

/**
 * POST Fetch Request
 * @param url - The URL endpoint
 * @param options - Options including payload and headers
 * @returns Promise with parsed JSON response
 */
export const postFetch = async (
  url: string,
  options: PostFetchOptions
): Promise<any> => {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const headers = {
      ...defaultHeaders,
      ...(options.headers || {}),
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(options.payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      data,
      status: response.status,
    }
  } catch (error) {
    console.error('POST Fetch Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    }
  }
}
