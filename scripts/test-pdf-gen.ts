import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { DuerpPdfDocument } from '@/lib/pdf/duerp-pdf';
import fs from 'fs';

async function test() {
  try {
    const data = {
      company: { name: 'Test', address: '123', city: 'City', employeeCount: 10 },
      version: 1, status: 'DRAFT', createdAt: new Date(), updatedAt: new Date(),
      evaluations: [], unitesTravail: [], accidentHistory: []
    };
    const element = React.createElement(DuerpPdfDocument, { data } as any);
    const buf = await renderToBuffer(element as any);
    console.log('PDF Generated Successfully! SIZE:', buf.length, 'bytes');
    fs.writeFileSync('/tmp/test-duerp-host.pdf', buf);
  } catch(e) {
    console.error('ERROR Generating PDF:', e);
  }
}
test();
