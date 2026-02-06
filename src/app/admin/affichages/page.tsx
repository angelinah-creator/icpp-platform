import { getAffichages, getCompaniesSimple } from "@/server/actions/admin"
import { AffichagesClient } from "./affichages-client"

export default async function AffichagesPage() {
    const [affichages, companies] = await Promise.all([
        getAffichages(),
        getCompaniesSimple()
    ])

    return <AffichagesClient initialAffichages={affichages} companies={companies} />
}
