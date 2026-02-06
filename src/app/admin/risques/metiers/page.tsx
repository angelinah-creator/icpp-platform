import { getRisquesMetier, getRisqueCategories, getMetiers } from "@/server/actions/admin"
import { RisquesClient } from "./risques-client"

export default async function RisquesMetierPage() {
    const [risques, categories, metiers] = await Promise.all([
        getRisquesMetier(),
        getRisqueCategories(),
        getMetiers()
    ])

    return (
        <RisquesClient
            initialRisques={risques}
            categories={categories.map(c => ({ code: c.code, nom: c.nom }))}
            metiers={metiers.map(m => ({ code: m.code, nom: m.nom }))}
        />
    )
}
