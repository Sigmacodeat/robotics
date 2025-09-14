#!/usr/bin/env node
/* Custom TS loader using TypeScript transpile + VM */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

function resolveTsPath(fromFile, request) {
  const base = request.startsWith('.')
    ? path.resolve(path.dirname(fromFile), request)
    : request;
  const tryPaths = [
    base,
    base + '.ts',
    base + '.tsx',
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const p of tryPaths) {
    if (p.startsWith('.') && !path.isAbsolute(p)) continue;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

function loadTsModule(filePath, cache = new Map()) {
  const absPath = path.resolve(filePath);
  if (cache.has(absPath)) return cache.get(absPath);
  const source = fs.readFileSync(absPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2019,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      jsx: ts.JsxEmit.Preserve,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      resolveJsonModule: true,
      isolatedModules: true,
      skipLibCheck: true,
    },
    fileName: absPath,
    reportDiagnostics: false,
  }).outputText;

  const sandbox = {
    module: { exports: {} },
    exports: {},
    __dirname: path.dirname(absPath),
    __filename: absPath,
    console,
    process,
    Buffer,
    require: (req) => {
      // Built-ins and node_modules
      if (!req.startsWith('.')) return require(req);
      const resolved = resolveTsPath(absPath, req);
      if (!resolved) throw new Error(`Cannot resolve TS module '${req}' from ${absPath}`);
      return loadTsModule(resolved, cache);
    },
  };
  vm.runInNewContext(transpiled, sandbox, { filename: absPath, displayErrors: true });
  const exported = sandbox.module.exports && Object.keys(sandbox.module.exports).length
    ? sandbox.module.exports
    : sandbox.exports;
  cache.set(absPath, exported);
  return exported;
}

module.exports = { loadTsModule };
