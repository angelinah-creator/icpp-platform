import { describe, it, expect } from 'vitest'
import {
  hasSubscriptionAccess,
  getSubscriptionStatusLabel,
} from '@/lib/subscription-access'

describe('Subscription Access Logic', () => {
  describe('hasSubscriptionAccess', () => {
    it('returns true for ACTIVE subscription in the future', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)
      expect(
        hasSubscriptionAccess({
          status: 'ACTIVE',
          currentPeriodEnd: futureDate,
        })
      ).toBe(true)
    })

    it('returns false for ACTIVE subscription in the past', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 10)
      expect(
        hasSubscriptionAccess({
          status: 'ACTIVE',
          currentPeriodEnd: pastDate,
        })
      ).toBe(false)
    })

    it('returns false for non-ACTIVE statuses', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)
      expect(
        hasSubscriptionAccess({
          status: 'CANCELED',
          currentPeriodEnd: futureDate,
        })
      ).toBe(false)
      expect(
        hasSubscriptionAccess({
          status: 'SUSPENDED',
          currentPeriodEnd: futureDate,
        })
      ).toBe(false)
      expect(
        hasSubscriptionAccess({
          status: 'PAST_DUE',
          currentPeriodEnd: futureDate,
        })
      ).toBe(false)
    })

    it('returns true if ACTIVE but no end date is set', () => {
      expect(
        hasSubscriptionAccess({
          status: 'ACTIVE',
          currentPeriodEnd: null,
        })
      ).toBe(true)
    })

    it('returns false for null or undefined subscription', () => {
      expect(hasSubscriptionAccess(null)).toBe(false)
      expect(hasSubscriptionAccess(undefined)).toBe(false)
      expect(hasSubscriptionAccess({})).toBe(false)
    })
  })

  describe('getSubscriptionStatusLabel', () => {
    it('returns correct label for known statuses', () => {
      expect(getSubscriptionStatusLabel('ACTIVE')).toBe('Actif')
      expect(getSubscriptionStatusLabel('TRIALING')).toBe('Essai en cours')
      expect(getSubscriptionStatusLabel('PAST_DUE')).toBe('Paiement en retard')
      expect(getSubscriptionStatusLabel('SUSPENDED')).toBe('Suspendu')
      expect(getSubscriptionStatusLabel('CANCELED')).toBe('Résilié')
    })

    it('returns default text for null or missing status', () => {
      expect(getSubscriptionStatusLabel(null)).toBe('Aucun abonnement')
      expect(getSubscriptionStatusLabel(undefined)).toBe('Aucun abonnement')
      expect(getSubscriptionStatusLabel('')).toBe('Aucun abonnement')
    })

    it('returns the raw status for unknown statuses', () => {
      expect(getSubscriptionStatusLabel('UNKNOWN_STATUS')).toBe('UNKNOWN_STATUS')
    })
  })
})