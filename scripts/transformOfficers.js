const fs = require('fs');
const path = require('path');

const IN = path.resolve('data/officers.json');
const OUT = path.resolve('data/officers.normalized.json');

const rows = JSON.parse(fs.readFileSync(IN, 'utf8'));

const norm = rows
  .map(r => {
    const no = String(r['No.'] ?? '').trim();
    const placa = String(r['Placa'] ?? '').trim();
    const name = String(r['Nombre completo'] ?? '').trim();
    const auth = String(r['Tipo de autorización'] ?? '').trim();
    if (!placa && !name) return null; // skip empty rows
    return {
      number: no || null,
      badge: placa || null,
      name: name || null,
      authorizationType: auth || null,
      slug: (placa || name).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
  })
  .filter(Boolean);

fs.writeFileSync(OUT, JSON.stringify(norm, null, 2), 'utf8');

console.log('Input records :', rows.length);
console.log('Output records:', norm.length);
console.log('Wrote         :', OUT);
console.log('Sample        :', norm.slice(0, 3));
