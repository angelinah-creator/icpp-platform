import { getMetiersWithUTs } from "@/server/actions/unites-travail"
import { UnitesTravailClient } from "./unites-travail-client"

export default async function UnitesTravailPage() {
    const metiers = await getMetiersWithUTs()
    return <UnitesTravailClient initialMetiers={metiers} />
}
