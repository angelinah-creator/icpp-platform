import { describe, it, expect } from 'vitest'
import {
  cn,
  formatDate,
  formatCurrency,
  truncate,
  getInitials,
} from '@/lib/utils'

describe('Utils Logic', () => {
  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
      expect(cn('px-2 py-1', { 'bg-blue-500': true, 'bg-red-500': false })).toBe('px-2 py-1 bg-blue-500')
    })
  })

  describe('formatDate', () => {
    it('formats date to french locale', () => {
      const date = new Date('2023-10-15T12:00:00Z')
      expect(formatDate(date)).toContain('15 octobre 2023')
    })
  })

  describe('formatCurrency', () => {
    it('formats cents to euros correctly', () => {
      // 1000 cents = 10.00 euros. We use replace to handle non-breaking spaces that Intl might output
      expect(formatCurrency(1000).replace(/\s/g, ' ')).toMatch(/10,00.*€/)
      expect(formatCurrency(0).replace(/\s/g, ' ')).toMatch(/0,00.*€/)
      expect(formatCurrency(1550).replace(/\s/g, ' ')).toMatch(/15,50.*€/)
    })
  })

  describe('truncate', () => {
    it('truncates strings longer than length', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
    })

    it('does not truncate strings shorter than or equal to length', () => {
      expect(truncate('Hello', 5)).toBe('Hello')
      expect(truncate('Hi', 5)).toBe('Hi')
    })
  })

  describe('getInitials', () => {
    it('returns up to 2 initials from a name', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Alice')).toBe('A')
      expect(getInitials('jean marc dubois')).toBe('JM')
      expect(getInitials('')).toBe('')
    })
  })
})
