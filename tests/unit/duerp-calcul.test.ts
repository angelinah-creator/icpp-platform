import { describe, expect, it } from "vitest"
import {
    calcIndicateurs,
    calcPrioriteAction,
    calcRisqueBrut,
    calcRisqueResiduel,
    getPonderation,
    getPrioriteStyle,
    getScoreStyleNew,
} from "@/lib/duerp-calcul"

describe("duerp-calcul", () => {
    it("returns the expected ponderation values", () => {
        expect(getPonderation("Aucune")).toBe(1)
        expect(getPonderation("Partielle")).toBe(0.7)
        expect(getPonderation("Organisationnelle")).toBe(0.5)
        expect(getPonderation("Protection collective")).toBe(0.3)
        expect(getPonderation("Maitrise inconnue")).toBe(1)
    })

    it("computes raw and residual risk values", () => {
        expect(calcRisqueBrut(4, 3)).toBe(12)
        expect(calcRisqueResiduel(4, 3, 0.5)).toBe(6)
        expect(calcRisqueResiduel(3, 3, 0.3333)).toBe(3)
    })

    it("maps residual risk to the correct priority", () => {
        expect(calcPrioriteAction(12)).toBe("Critique")
        expect(calcPrioriteAction(8)).toBe("Élevé")
        expect(calcPrioriteAction(4)).toBe("Modéré")
        expect(calcPrioriteAction(3.99)).toBe("Faible")
    })

    it("calculates all indicators in one pass", () => {
        expect(calcIndicateurs(4, 3, "Organisationnelle")).toEqual({
            ponderation: 0.5,
            risqueBrut: 12,
            risqueResiduel: 6,
            prioriteAction: "Modéré",
        })
    })

    it("returns consistent UI styles for priorities and scores", () => {
        expect(getPrioriteStyle("Critique").label).toBe("Critique")
        expect(getPrioriteStyle("Élevé").bg).toContain("amber")
        expect(getPrioriteStyle("Modéré").bg).toContain("orange")
        expect(getScoreStyleNew(12).bg).toContain("red")
        expect(getScoreStyleNew(2).bg).toContain("emerald")
    })
})