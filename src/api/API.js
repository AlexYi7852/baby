import axios from 'axios'

// 请求前部
export let prefix = '/api/'

/**
 * GET请求
 * @param {string} path
 * @param params
 * @param headers
 * @returns {Promise<>}
 */
export async function get (path, params, headers) {
  return bodyOf(request('get', path, params, headers))
}

/**
 * POST请求
 * @param {string} path
 * @param params
 * @param headers
 * @returns {Promise<>}
 */
export async function post (path, params, headers) {
  return bodyOf(request('post', path, params, headers))
}

/**
 * PUT请求
 * @param {string} path
 * @param params
 * @param headers
 * @returns {Promise<>}
 */
export async function put (path, params, headers) {
  return bodyOf(request('put', path, params, headers))
}

/**
 * DELETE请求
 * @param {string} path
 * @param params
 * @param headers
 * @returns {Promise<>}
 */
export async function remove (path, params, headers) {
  return bodyOf(request('delete', path, params, headers))
}

/**
 * 请求
 * @param {string} method
 * @param {string} path
 * @param params
 * @param headers
 * @returns {Promise<{status; headers; body}>}
 */
export async function request (method, path, params, headers) {
  let url = `${prefix}${path}`
  const response = await sendRequest(method, url, params, headers)
  return handleResponse(
    path,
    response
  )
}

/**
 * 发送请求
 * @param {string} method
 * @param {string} url
 * @param params
 * @param headers
 * @returns {Promise<AxiosPromise>}
 */
async function sendRequest (method, url, params, headers) {
  let args = {}
  if (method === 'get' || method === 'delete') {
    args = params ? { method, url, params } : { method, url }
  } else {
    args = params ? { method, url, data: params } : { method, url }
  }

  if (headers) {
    args.headers = headers
  }
  return axios(args)
}

/**
 * Receives and reads a HTTP response
 */
async function handleResponse (path, response) {
  try {
    const status = response.status
    // `fetch` promises resolve even if HTTP status indicates failure. Reroute
    // promise flow control to interpret error responses as failures
    if (status >= 400) {
      const message = await getErrorMessageSafely(response)
      const error = new Error(message)
      throw error
    }
    // parse response text
    const responseBody = await response.data
    return {
      status: response.status,
      headers: response.headers,
      body: responseBody
    }
  } catch (e) {
    throw e
  }
}

// try to get the best possible error message out of a response
// without throwing errors while parsing
async function getErrorMessageSafely (response) {
  try {
    const body = await response.data
    if (!body) {
      return ''
    }

    // Optimal case is JSON with a defined message property
    const payload = JSON.parse(body)
    if (payload && payload.message) {
      return payload.message
    }

    // Should that fail, return the whole response body as text
    return body
  } catch (e) {
    // Unreadable body, return whatever the server returned
    return response._bodyInit
  }
}

/**
 * 返回body处理
 * @param requestPromise
 * @returns {Promise<>}
 */
async function bodyOf (requestPromise) {
  try {
    const response = await requestPromise
    return response.body
  } catch (e) {
    throw e
  }
}