/**
 * Script to modify schema.prisma to add UniteTravail model
 * This script makes the following changes:
 * 1. Adds UniteTravail model after MetierICPP
 * 2. Adds unitesTravail relation to MetierICPP
 * 3. Removes risques relation from MetierICPP
 * 4. Modifies RisqueMetier to use uniteTravailId instead of metierCode
 * 5. Changes gravite from String to Int
 * 6. Updates indexes
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// 1. Add unitesTravail relation to MetierICPP and remove risques relation
schema = schema.replace(
    /model MetierICPP \{[\s\S]*?\/\/ Relations\s+companies\s+Company\[\]\s+risques\s+RisqueMetier\[\]/,
    (match) => {
        return match.replace(
            /\/\/ Relations\s+companies\s+Company\[\]\s+risques\s+RisqueMetier\[\]/,
            `// Relations
  companies       Company[]
  unitesTravail   UniteTravail[]`
        );
    }
);

// 2. Add UniteTravail model after MetierICPP
const uniteTravailModel = `
// ============================================
// UNITÉS DE TRAVAIL (UT) PAR MÉTIER
// ============================================

model UniteTravail {
  id          String   @id @default(cuid())
  
  // Métier parent
  metierCode  String
  metier      MetierICPP @relation(fields: [metierCode], references: [code], onDelete: Cascade)
  
  // Informations
  nom         String   // "UT1 : Accueil / Vente"
  description String?  // Description optionnelle
  ordre       Int      @default(1) // Ordre d'affichage (1, 2, 3...)
  
  // Relations
  risques     RisqueMetier[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([metierCode])
  @@map("unites_travail")
}

`;

schema = schema.replace(
    /(model MetierICPP \{[\s\S]*?@@map\("metiers_icpp"\)\s*\})\s*\n/,
    `$1\n${uniteTravailModel}`
);

// 3. Modify RisqueMetier model - replace metierCode with uniteTravailId
schema = schema.replace(
    /\/\/ Métier concerné\s+metierCode\s+String\s+metier\s+MetierICPP @relation\(fields: \[metierCode\], references: \[code\]\)/,
    `// Unité de Travail
  uniteTravailId  String
  uniteTravail    UniteTravail @relation(fields: [uniteTravailId], references: [id], onDelete: Cascade)`
);

// 4. Change gravite from String to Int in RisqueMetier
schema = schema.replace(
    /gravite\s+String\s+\/\/ FAIBLE, MOYEN, ELEVE/,
    `gravite         Int      @default(2) // 1 (Mineur) à 5 (Décès)`
);

// 5. Update indexes in RisqueMetier - replace metierCode with uniteTravailId
schema = schema.replace(
    /(model RisqueMetier \{[\s\S]*?)@@index\(\[metierCode\]\)/,
    '$1@@index([uniteTravailId])'
);

// Write the modified schema
fs.writeFileSync(schemaPath, schema, 'utf-8');

console.log('✅ Schema.prisma successfully modified');
console.log('Changes made:');
console.log('  - Added UniteTravail model');
console.log('  - Updated MetierICPP relations');
console.log('  - Modified RisqueMetier to use uniteTravailId');
console.log('  - Changed gravite to Int (1-5)');
console.log('  - Updated indexes');
