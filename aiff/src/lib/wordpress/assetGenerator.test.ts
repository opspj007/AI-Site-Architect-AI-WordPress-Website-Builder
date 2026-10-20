import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProceduralAbstractArt, getInitialStockAssets } from './assetGenerator.ts';

test('generateProceduralAbstractArt returns valid SVG data URI', () => {
  const dataUri = generateProceduralAbstractArt('modern luxury silk waves', 'abstract-fluid');
  assert.ok(dataUri.startsWith('data:image/svg+xml;base64,'));
  
  // Decode base64 to ensure it contains SVG tags
  const base64Str = dataUri.replace('data:image/svg+xml;base64,', '');
  const decoded = Buffer.from(base64Str, 'base64').toString('utf-8');
  assert.ok(decoded.includes('<svg'));
  assert.ok(decoded.includes('</svg>'));
  assert.ok(decoded.includes('gradFlow'));
});

test('generateProceduralAbstractArt respects custom palette in dark luxury style', () => {
  const customPalette = {
    primary: '#090a0f',
    secondary: '#38bdf8',
    accent: '#f43f5e',
    background: '#ffffff',
  };
  const dataUri = generateProceduralAbstractArt('cyberpunk glow', 'dark-luxury-gradient', customPalette);
  const base64Str = dataUri.replace('data:image/svg+xml;base64,', '');
  const decoded = Buffer.from(base64Str, 'base64').toString('utf-8');
  assert.ok(decoded.includes('#f43f5e'));
});

test('generateProceduralAbstractArt supports architectural-shadows and geometric-minimal styles', () => {
  const archUri = generateProceduralAbstractArt('concrete shadows', 'architectural-shadows');
  assert.ok(archUri.startsWith('data:image/svg+xml;base64,'));

  const geoUri = generateProceduralAbstractArt('geometric circles', 'geometric-minimal');
  assert.ok(geoUri.startsWith('data:image/svg+xml;base64,'));
});

test('getInitialStockAssets returns curated stock assets with Imagen model tag', () => {
  const assets = getInitialStockAssets();
  assert.ok(assets.length >= 4);
  assert.ok(assets.some(a => a.model.includes('imagen')));
  assert.ok(assets.some(a => a.category === 'abstract'));
  assert.ok(assets.every(a => Boolean(a.url) && Boolean(a.prompt)));
});
