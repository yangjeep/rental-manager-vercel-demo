#!/usr/bin/env node
// Patch @cloudflare/next-on-pages to use platform: 'node' instead of 'neutral'
// This fixes the async_hooks bundling issue

const fs = require('fs');
const path = require('path');

const adapterPath = path.join(__dirname, '..', 'node_modules', '@cloudflare', 'next-on-pages', 'dist', 'index.js');

if (!fs.existsSync(adapterPath)) {
  console.log('⚠️  Adapter file not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(adapterPath, 'utf8');
const before = content;

// Replace all instances of platform: "neutral" with platform: "node"
content = content.replace(/platform: "neutral"/g, 'platform: "node"');

if (content === before) {
  console.log('⚠️  No changes made - adapter may already be patched or format changed');
} else {
  fs.writeFileSync(adapterPath, content, 'utf8');
  console.log('✅ Patched @cloudflare/next-on-pages to use platform: "node"');
}

