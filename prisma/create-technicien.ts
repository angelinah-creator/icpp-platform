import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTechnicien() {
    try {
        const hashedPassword = await bcrypt.hash('technicien123', 10)

        const technicien = await prisma.user.create({
            data: {
                email: 'technicien@icpp.fr',
                password: hashedPassword,
                name: 'Marc Technicien',
                role: 'TECHNICIEN',
                phone: '+33 6 12 34 56 78',
                emailVerified: new Date()
            }
        })

        console.log('✅ Compte TECHNICIEN créé avec succès!')
        console.log('📧 Email:', technicien.email)
        console.log('🔑 Mot de passe: technicien123')
        console.log('👤 Nom:', technicien.name)
        console.log('🎭 Rôle:', technicien.role)
        console.log('\n🚀 Vous pouvez maintenant vous connecter à /login avec ces identifiants')
    } catch (error: any) {
        if (error.code === 'P2002') {
            console.log('⚠️  Un compte technicien@icpp.fr existe déjà')
        } else {
            console.error('❌ Erreur lors de la création du compte:', error)
        }
    } finally {
        await prisma.$disconnect()
    }
}

createTechnicien()
