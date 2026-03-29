import { describe, expect, it } from 'vitest'
import { isEmpty, validateRequired, isValidGender, isValidObjectId, parseIntOrDefault, canDeductStock } from '../lib/utils/validation'

describe('isEmpty', () => {
  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true)
  })

  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true)
  })

  it('should return true for whitespace only', () => {
    expect(isEmpty('   ')).toBe(true)
  })

  it('should return false for valid string', () => {
    expect(isEmpty('John')).toBe(false)
  })
})

describe('validateRequired', () => {
  it('should return valid for complete data', () => {
    const data = { name: 'John', gender: 'male' }
    const result = validateRequired(data, ['name', 'gender'])
    expect(result.valid).toBe(true)
    expect(result.missing).toEqual([])
  })

  it('should return invalid for missing fields', () => {
    const data = { name: 'John' }
    const result = validateRequired(data, ['name', 'gender'])
    expect(result.valid).toBe(false)
    expect(result.missing).toContain('gender')
  })

  it('should return invalid for empty fields', () => {
    const data = { name: 'John', gender: '' }
    const result = validateRequired(data, ['name', 'gender'])
    expect(result.valid).toBe(false)
    expect(result.missing).toContain('gender')
  })

  it('should handle nested empty values', () => {
    const data = { name: 'John', gender: '  ' }
    const result = validateRequired(data, ['name', 'gender'])
    expect(result.valid).toBe(false)
  })
})

describe('isValidGender', () => {
  it('should return true for male', () => {
    expect(isValidGender('male')).toBe(true)
    expect(isValidGender('Male')).toBe(true)
    expect(isValidGender('MALE')).toBe(true)
  })

  it('should return true for female', () => {
    expect(isValidGender('female')).toBe(true)
    expect(isValidGender('Female')).toBe(true)
  })

  it('should return false for invalid gender', () => {
    expect(isValidGender('other')).toBe(false)
    expect(isValidGender('')).toBe(false)
    expect(isValidGender(null)).toBe(false)
    expect(isValidGender(undefined)).toBe(false)
  })
})

describe('isValidObjectId', () => {
  it('should return true for valid ObjectId', () => {
    expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true)
  })

  it('should return false for invalid ObjectId', () => {
    expect(isValidObjectId('invalid')).toBe(false)
    expect(isValidObjectId('123')).toBe(false)
    expect(isValidObjectId('')).toBe(false)
    expect(isValidObjectId(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isValidObjectId(undefined)).toBe(false)
  })
})

describe('parseIntOrDefault', () => {
  it('should parse valid integer string', () => {
    expect(parseIntOrDefault('42')).toBe(42)
    expect(parseIntOrDefault('0')).toBe(0)
  })

  it('should return default for invalid string', () => {
    expect(parseIntOrDefault('abc')).toBe(0)
    expect(parseIntOrDefault('')).toBe(0)
  })

  it('should return custom default when provided', () => {
    expect(parseIntOrDefault('abc', 99)).toBe(99)
  })

  it('should return number for number input', () => {
    expect(parseIntOrDefault(42)).toBe(42)
  })
})

describe('canDeductStock', () => {
  it('should return true when deduction is valid', () => {
    expect(canDeductStock(100, 50)).toBe(true)
    expect(canDeductStock(100, 100)).toBe(true)
  })

  it('should return false when stock would go negative', () => {
    expect(canDeductStock(50, 100)).toBe(false)
    expect(canDeductStock(0, 1)).toBe(false)
  })

  it('should return true when stock equals deduction', () => {
    expect(canDeductStock(100, 100)).toBe(true)
  })
})
