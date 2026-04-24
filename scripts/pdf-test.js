require('@babel/register')({
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript'
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
});
const fs = require('fs');
const path = require('path');
const React = require('react');
const { renderToBuffer } = require('@react-pdf/renderer');
const { PrismaClient } = require('@prisma/client');
const { DuerpPdfDocument } = require('./src/lib/pdf/duerp-pdf.tsx');

async function test() {
    const prisma = new PrismaClient();
    const duerp = await prisma.duerpDocument.findFirst({
        include: {
            company: { include: { metier: { include: { unitesTravail: { orderBy: { ordre: 'asc' } } } } } },
            evaluations: { include: { risque: { include: { categorie: true, uniteTravail: true } } }, orderBy: { uniteTravail: 'asc' } }
        }
    });
    
    if (!duerp) throw new Error('No duerp');

    const evaluations = duerp.evaluations.map(ev => ({
        risqueNom: ev.risque.nom,
        risqueDescription: ev.risque.description || '',
        categorieNom: ev.risque.categorie.nom,
        categorieCode: ev.risque.categorie.code,
        uniteTravail: ev.uniteTravail,
        frequence: ev.frequence,
        gravite: ev.gravite,
        niveauRisque: ev.frequence * ev.gravite,
        ponderation: ev.ponderation ?? 1,
        risqueResiduel: ev.risqueResiduel ?? (ev.frequence * ev.gravite * (ev.ponderation ?? 1)),
        mesuresAppliquees: [],
        actionCorrective: ev.actionCorrective || undefined,
        delai: ev.delai || undefined,
        responsable: ev.responsable || undefined,
        observations: ev.observations || undefined,
        niveauMaitrise: ev.niveauMaitrise,
        prioriteAction: ev.prioriteAction || undefined
    }));

    const pdfData = {
        companyName: duerp.company.name,
        siret: duerp.company.siret || 'Non renseigné',
        address: duerp.company.address,
        city: duerp.company.city,
        postalCode: duerp.company.postalCode || '',
        activitySector: duerp.company.metier?.nom || 'Non spécifié',
        employeeCount: duerp.company.employeeCount,
        contactName: duerp.company.contactName || undefined,
        contactRole: duerp.company.contactRole || undefined,
        contactEmail: duerp.company.contactEmail || undefined,
        version: duerp.version,
        status: duerp.status,
        createdAt: duerp.createdAt,
        updatedAt: duerp.updatedAt,
        nextReviewDate: duerp.nextReviewDate || undefined,
        evaluations,
        unitesTravail: []
    };

    console.log('Rendering...');
    const element = React.createElement(DuerpPdfDocument, { data: pdfData });
    const buf = await renderToBuffer(element);
    fs.writeFileSync('/tmp/duerp-output-test.pdf', buf);
    console.log('PDF written. Size:', buf.length);
    prisma.$disconnect();
}
test().catch(e => { console.error(e); process.exit(1); });
