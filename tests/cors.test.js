import { describe, expect, it } from 'vitest'
import { corsResponse, handleOptions } from '../lib/utils/cors'

describe('corsResponse', () => {
  it('should be a function', () => {
    expect(typeof corsResponse).toBe('function')
  })

  it('should return a Response-like object with headers', () => {
    const response = corsResponse({ message: 'test' })
    expect(response).toBeDefined()
    expect(response.headers).toBeDefined()
  })
})

describe('handleOptions', () => {
  it('should be a function', () => {
    expect(typeof handleOptions).toBe('function')
  })

  it('should return a response with status 204', () => {
    const response = handleOptions()
    expect(response.status).toBe(204)
  })
})
