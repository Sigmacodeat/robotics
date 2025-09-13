#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'src', 'i18n', 'messages', 'combined.json');

function ensure(obj, pathArr, init){
  let cur = obj;
  for (let i=0;i<pathArr.length-1;i++){
    const k = pathArr[i];
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  const last = pathArr[pathArr.length-1];
  if (typeof cur[last] === 'undefined') cur[last] = init;
}

function leaf(de,en){return {de,en};}

function main(){
  if (!fs.existsSync(file)) {
    console.log('[i18n] ensure-headings: combined.json nicht gefunden – überspringe (no-op).');
    return;
  }
  const data = JSON.parse(fs.readFileSync(file,'utf8'));
  if (!data.bp) data.bp = {};
  if (!data.bp.headings) data.bp.headings = {};
  if (!data.bp.notes) data.bp.notes = {};

  ensure(data, ['bp','headings','teamOrg'], leaf('Organisation & Aufbau','Organization & structure'));
  ensure(data, ['bp','headings','roles'], leaf('Rollen & Verantwortlichkeiten','Roles & responsibilities'));
  ensure(data, ['bp','headings','esop'], leaf('ESOP & Incentives','ESOP & incentives'));
  ensure(data, ['bp','notes','esop'], leaf('ESOP‑Richtlinien, Vesting, Pool‑Größe und Mitarbeiterbeteiligung werden hier ausgeführt.','ESOP policies, vesting, pool size and employee participation are detailed here.'));

  fs.writeFileSync(file, JSON.stringify(data, null, 2)+'\n','utf8');
  console.log('Ensured headings and notes in combined.json');
}

main();
