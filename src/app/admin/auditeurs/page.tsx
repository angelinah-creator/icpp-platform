import { getAuditors } from "@/server/actions/admin"
import { AuditeursClient } from "./auditeurs-client"

export default async function AuditeursPage() {
    const auditors = await getAuditors()

    return <AuditeursClient initialAuditors={auditors} />
}
