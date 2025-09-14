#!/usr/bin/env node
/*
  Deep-flatten locale files: replace any object that has only 'de'/'en' keys
  with the available value; recurse arrays/objects. Applies to both de/en files.
*/
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const msgsDir = path.join(root, 'src', 'i18n', 'messages');

function isPlainObject(v){return v && typeof v==='object' && !Array.isArray(v);} 

function flattenNodeForLocale(node, locale){
  if (Array.isArray(node)) return node.map((el)=>flattenNodeForLocale(el, locale));
  if (!isPlainObject(node)) return node;
  const keys = Object.keys(node);
  const hasDe = Object.prototype.hasOwnProperty.call(node,'de');
  const hasEn = Object.prototype.hasOwnProperty.call(node,'en');
  const onlyLang = keys.length>0 && keys.every(k=>k==='de'||k==='en');
  if (onlyLang && (hasDe || hasEn)){
    const base = locale==='de' ? (hasDe? node.de : node.en) : (hasEn? node.en : node.de);
    return flattenNodeForLocale(base, locale);
  }
  const out = Array.isArray(node)? [] : {};
  for (const k of keys){
    out[k] = flattenNodeForLocale(node[k], locale);
  }
  return out;
}

function processLocale(locale){
  const file = path.join(msgsDir, `${locale}.json`);
  if (!fs.existsSync(file)) return console.error('Missing', file);
  const raw = fs.readFileSync(file,'utf8');
  const json = JSON.parse(raw);
  const flattened = flattenNodeForLocale(json, locale);
  fs.writeFileSync(file, JSON.stringify(flattened, null, 2)+'\n','utf8');
  console.log('Fixed', path.relative(process.cwd(), file));
}

processLocale('de');
processLocale('en');
