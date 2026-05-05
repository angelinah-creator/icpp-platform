import { describe, it, expect } from 'vitest'
import {
  getPonderation,
  calcRisqueBrut,
  calcRisqueResiduel,
  calcPrioriteAction,
  calcIndicateurs,
} from '@/lib/duerp-calcul'

describe('DUERP Calcul Logic', () => {
  describe('getPonderation', () => {
    it('returns correct ponderation for known levels', () => {
      expect(getPonderation('Aucune')).toBe(1)
      expect(getPonderation('Partielle')).toBe(0.7)
      expect(getPonderation('Organisationnelle')).toBe(0.5)
      expect(getPonderation('Protection collective')).toBe(0.3)
      expect(getPonderation('Maîtrise optimale')).toBe(0.2)
    })

    it('returns default (1) for unknown levels', () => {
      expect(getPonderation('Inconnu')).toBe(1)
      expect(getPonderation('')).toBe(1)
    })
  })

  describe('calcRisqueBrut', () => {
    it('calculates brut risk correctly', () => {
      expect(calcRisqueBrut(5, 5)).toBe(25)
      expect(calcRisqueBrut(2, 3)).toBe(6)
      expect(calcRisqueBrut(0, 5)).toBe(0)
    })
  })

  describe('calcRisqueResiduel', () => {
    it('calculates and rounds residual risk correctly', () => {
      expect(calcRisqueResiduel(5, 5, 0.7)).toBe(17.5)
      expect(calcRisqueResiduel(4, 3, 0.3)).toBe(3.6)
      expect(calcRisqueResiduel(1, 1, 0.2)).toBe(0.2)
    })
  })

  describe('calcPrioriteAction', () => {
    it('returns correct priority based on residual risk', () => {
      expect(calcPrioriteAction(12)).toBe('Critique')
      expect(calcPrioriteAction(25)).toBe('Critique')
      expect(calcPrioriteAction(8)).toBe('Élevé')
      expect(calcPrioriteAction(11.9)).toBe('Élevé')
      expect(calcPrioriteAction(4)).toBe('Modéré')
      expect(calcPrioriteAction(7.9)).toBe('Modéré')
      expect(calcPrioriteAction(3.9)).toBe('Faible')
      expect(calcPrioriteAction(0)).toBe('Faible')
    })
  })

  describe('calcIndicateurs', () => {
    it('calculates all indicators at once', () => {
      const result = calcIndicateurs(4, 4, 'Organisationnelle')
      expect(result).toEqual({
        ponderation: 0.5,
        risqueBrut: 16,
        risqueResiduel: 8,
        prioriteAction: 'Élevé',
      })
    })

    it('handles worst case scenario', () => {
      const result = calcIndicateurs(5, 5, 'Aucune')
      expect(result).toEqual({
        ponderation: 1,
        risqueBrut: 25,
        risqueResiduel: 25,
        prioriteAction: 'Critique',
      })
    })

    it('handles best case scenario', () => {
      const result = calcIndicateurs(1, 1, 'Maîtrise optimale')
      expect(result).toEqual({
        ponderation: 0.2,
        risqueBrut: 1,
        risqueResiduel: 0.2,
        prioriteAction: 'Faible',
      })
    })
  })
})