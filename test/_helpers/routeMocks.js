// Helpers for route-level tests
export function makeReq(body = {}, url = 'http://localhost') {
  return { json: async () => body, url }
}

export function makeReqWithUrl(body = {}, path = '/') {
  const url = `http://localhost${path}`
  return makeReq(body, url)
}

// Simple helper to create a request that includes query params (e.g. ?id=123)
export function makeReqWithId(body = {}, id = 'id-1') {
  const url = `http://localhost/?id=${id}`
  return makeReq(body, url)
}
