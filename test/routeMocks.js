// Helpers for route-level tests (flat under test/)
export function makeReq(body = {}, url = 'http://localhost') {
  return { json: async () => body, url }
}

export function makeReqWithUrl(body = {}, path = '/') {
  const url = `http://localhost${path}`
  return makeReq(body, url)
}

export function makeReqWithId(body = {}, id = 'id-1') {
  const url = `http://localhost/?id=${id}`
  return makeReq(body, url)
}
