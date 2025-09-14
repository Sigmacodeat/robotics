#!/usr/bin/env node
/*
  Recursively flatten any objects that have only a 'de' field (for de.json) or only an 'en' field (for en.json),
  or objects that have both 'de' and 'en' at leaves (keep current locale value).
  Usage: node scripts/flatten-locale.js de
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const msgsDir = path.join(root, 'src', 'i18n', 'messages');
const locale = process.argv[2];
if (!locale || !['de','en'].includes(locale)) {
  console.error('Usage: node scripts/flatten-locale.js <de|en>');
  process.exit(1);
}
const filePath = path.join(msgsDir, `${locale}.json`);

function isPlainObject(v){return v && typeof v==='object' && !Array.isArray(v);} 

function flatten(node){
  if (Array.isArray(node)) return node.map(flatten);
  if (!isPlainObject(node)) return node;
  const keys = Object.keys(node);
  const hasDe = Object.prototype.hasOwnProperty.call(node,'de');
  const hasEn = Object.prototype.hasOwnProperty.call(node,'en');
  const onlyLangKeys = keys.every(k=>k==='de'||k==='en');
  if (onlyLangKeys && (hasDe || hasEn)){
    return locale==='de' ? (hasDe? flatten(node.de) : flatten(node.en))
                         : (hasEn? flatten(node.en) : flatten(node.de));
  }
  const out = Array.isArray(node)? [] : {};
  for (const k of keys){
    out[k] = flatten(node[k]);
  }
  return out;
}

function main(){
  const raw = fs.readFileSync(filePath,'utf8');
  const json = JSON.parse(raw);
  const flattened = flatten(json);
  fs.writeFileSync(filePath, JSON.stringify(flattened, null, 2)+'\n','utf8');
  console.log('Flattened', path.relative(process.cwd(), filePath));
}

main();
