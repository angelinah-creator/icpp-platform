import { getSettings } from "@/server/actions/admin"
import { ParametresClient } from "./parametres-client"

export default async function ParametresPage() {
    const settings = await getSettings()
    return <ParametresClient initialSettings={settings} />
}
