# INCP Platform - Plateforme de Conformité DUERP

Plateforme SaaS pour la conformité DUERP des TPE en France.

## 🚀 Installation

```bash
npm install
```

## 🗄️ Base de données

### Avec Docker (recommandé)
```bash
# Lancer PostgreSQL
docker run --name incp-postgres \
  -e POSTGRES_USER=incp \
  -e POSTGRES_PASSWORD=secret123 \
  -e POSTGRES_DB=incp_platform \
  -p 5432:5432 \
  -d postgres:16

# Initialiser Prisma
npm run db:push
npm run db:generate
```

## 💻 Développement

```bash
# Lancer le serveur
npm run dev

# Ouvrir http://localhost:3000
```

## 🎨 Intégration Figma

### Workflow
1. Designer crée composants sur Figma
2. Export avec Anima/Locofy OU copie manuelle
3. Intégration dans `src/components/`
4. Utiliser shadcn/ui comme base

### Conventions de nommage
- Composants: `PascalCase.tsx`
- Props: interface `ComponentProps`
- Variants: avec `cva()` de class-variance-authority

### Exemple
```tsx
// Figma: "Button/Primary/Large"
// Code: src/components/ui/button.tsx (déjà fourni par shadcn)
<Button variant="default" size="lg">Cliquez ici</Button>
```

## 📁 Structure

```
src/
├── app/              # Routes (App Router)
├── components/       # Composants React
│   ├── ui/          # Design system (shadcn)
│   ├── layout/      # Layout (navbar, footer)
│   ├── auth/        # Auth components
│   ├── dashboard/   # Dashboard components
│   ├── duerp/       # DUERP wizard
│   └── admin/       # Admin components
├── lib/             # Utilitaires
├── server/          # Server actions & services
├── types/           # Types TypeScript
└── config/          # Configuration
```

## 🛠️ Scripts disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build pour production
npm run start        # Démarrer le serveur de production
npm run lint         # Linter le code
npm run format       # Formater le code avec Prettier
npm run type-check   # Vérifier les types TypeScript
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma vers la DB
npm run db:migrate   # Créer une migration
npm run db:studio    # Ouvrir Prisma Studio
```

## 📚 Stack Technique

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5
- **Payment**: Stripe
- **PDF**: @react-pdf/renderer
- **Forms**: React Hook Form + Zod
- **State**: Zustand

## ✅ Checklist avant développement

- [ ] PostgreSQL en cours d'exécution
- [ ] `.env.local` configuré
- [ ] `npm run dev` fonctionne
- [ ] `npm run type-check` sans erreur
- [ ] shadcn/ui composants installés

## 🔐 Variables d'environnement

Copier `.env.example` vers `.env.local` et remplir les valeurs.

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
