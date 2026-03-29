import { describe, expect, it } from 'vitest'
import { calculateAge, formatDate, getDayBounds } from '../lib/utils/dateUtils'

describe('calculateAge', () => {
  it('should return N/A for null birthday', () => {
    expect(calculateAge(null)).toBe('N/A')
    expect(calculateAge(undefined)).toBe('N/A')
  })

  it('should return N/A for invalid date', () => {
    expect(calculateAge('invalid')).toBe('N/A')
  })

  it('should return age in years for adult', () => {
    const today = new Date()
    const birthDate = new Date(today.getFullYear() - 25, 0, 1)
    const result = calculateAge(birthDate)
    expect(result).toBe('25 years old')
  })

  it('should return age in months for infants', () => {
    const today = new Date()
    const birthDate = new Date(today.getFullYear(), today.getMonth() - 3, 1)
    const result = calculateAge(birthDate)
    expect(result).toBe('3 months old')
  })

  it('should return age in days for newborns', () => {
    const today = new Date()
    const birthDate = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
    const result = calculateAge(birthDate)
    expect(result).toBe('10 days old')
  })

  it('should return detailed age when requested', () => {
    const today = new Date()
    const birthDate = new Date(today.getFullYear() - 25, 5, 15)
    const result = calculateAge(birthDate, true)
    expect(result).toMatch(/\d+ years, \d+ months, \d+ days old/)
  })
})

describe('formatDate', () => {
  it('should return N/A for null date', () => {
    expect(formatDate(null)).toBe('N/A')
  })

  it('should format date correctly', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('January')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('should accept custom options', () => {
    const result = formatDate('2024-01-15', { year: 'numeric', month: 'short', day: 'numeric' })
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })
})

describe('getDayBounds', () => {
  it('should return start and end of day', () => {
    const date = new Date('2024-01-15T14:30:00')
    const { start, end } = getDayBounds(date)
    
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
    expect(start.getSeconds()).toBe(0)
    
    expect(end.getHours()).toBe(23)
    expect(end.getMinutes()).toBe(59)
    expect(end.getSeconds()).toBe(59)
  })

  it('should handle date string', () => {
    const { start, end } = getDayBounds('2024-01-15')
    expect(start instanceof Date).toBe(true)
    expect(end instanceof Date).toBe(true)
  })
})
