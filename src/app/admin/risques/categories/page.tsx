import { getRisqueCategories } from "@/server/actions/admin"
import { CategoriesClient } from "./categories-client"

export default async function CategoriesPage() {
    const categories = await getRisqueCategories()
    return <CategoriesClient initialCategories={categories} />
}
