import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeGutenbergBlock, serializePageBlocks } from './blockSerializer.ts';
import { generateWXRXml } from './wxrGenerator.ts';
import { generatePluginPhp } from './pluginGenerator.ts';
import { generateThemeJson } from './themeJsonGenerator.ts';
import { createFashionAgencySite, createSiteFromPrompt } from './fallbackGenerator.ts';
import type { GutenbergBlock } from '../../types/wordpress.ts';

test('serializeGutenbergBlock handles core/heading with level and alignment', () => {
  const block: GutenbergBlock = {
    id: 'h1',
    blockName: 'core/heading',
    attrs: { level: 2, textAlign: 'center', content: 'Modern Fashion Headline' },
  };
  const result = serializeGutenbergBlock(block);
  assert.ok(result.includes('<!-- wp:heading {"level":2,"textAlign":"center"} -->'));
  assert.ok(result.includes('<h2 class="wp-block-heading has-text-align-center">Modern Fashion Headline</h2>'));
  assert.ok(result.includes('<!-- /wp:heading -->'));
});

test('serializeGutenbergBlock handles core/cover with inner blocks', () => {
  const block: GutenbergBlock = {
    id: 'cov1',
    blockName: 'core/cover',
    attrs: { url: 'https://images.unsplash.com/fashion.jpg', dimRatio: 50, title: 'Hero' },
    innerBlocks: [
      {
        id: 'p1',
        blockName: 'core/paragraph',
        attrs: { content: 'Runway excellence' },
      },
    ],
  };
  const result = serializeGutenbergBlock(block);
  assert.ok(result.includes('<!-- wp:cover'));
  assert.ok(result.includes('Runway excellence'));
  assert.ok(result.includes('<!-- /wp:cover -->'));
});

test('createFashionAgencySite generates requested pages and structure', () => {
  const site = createFashionAgencySite();
  assert.equal(site.name, 'Maison Atelier');
  assert.equal(site.pages.length, 5);

  const pageSlugs = site.pages.map(p => p.slug);
  assert.deepEqual(pageSlugs, ['home', 'about', 'services', 'portfolio', 'contact']);

  const homePage = site.pages.find(p => p.slug === 'home')!;
  assert.equal(homePage.isFrontPage, true);
  assert.ok(homePage.blocks.length >= 5);

  assert.ok(site.customPostTypes.some(cpt => cpt.slug === 'portfolio_item'));
  assert.ok(site.menus.some(m => m.location === 'primary'));
});

test('generateWXRXml outputs valid WordPress WXR 1.2 XML', () => {
  const site = createFashionAgencySite();
  const xml = generateWXRXml(site);

  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8" ?>'));
  assert.ok(xml.includes('<wp:wxr_version>1.2</wp:wxr_version>'));
  assert.ok(xml.includes('<title><![CDATA[Maison Atelier]]></title>'));
  assert.ok(xml.includes('<wp:post_type><![CDATA[page]]></wp:post_type>'));
  assert.ok(xml.includes('<wp:post_name><![CDATA[portfolio]]></wp:post_name>'));
  assert.ok(xml.includes('<wp:post_type><![CDATA[portfolio_item]]></wp:post_type>'));
  assert.ok(xml.includes('<wp:post_type><![CDATA[nav_menu_item]]></wp:post_type>'));
  assert.ok(xml.includes('<!-- wp:cover'));
  assert.ok(xml.includes('</channel>'));
  assert.ok(xml.includes('</rss>'));
});

test('generatePluginPhp creates valid WordPress PHP plugin syntax', () => {
  const site = createFashionAgencySite();
  const php = generatePluginPhp(site);

  assert.ok(php.startsWith('<?php'));
  assert.ok(php.includes('Plugin Name: AI Site Architect - Maison Atelier'));
  assert.ok(php.includes("register_post_type('portfolio_item'"));
  assert.ok(php.includes("register_nav_menus("));
  assert.ok(php.includes("function activate_plugin()"));
  assert.ok(php.includes("wp_insert_post("));
  assert.ok(php.includes("'post_name'      => 'home'"));
  assert.ok(php.includes("'post_name'      => 'services'"));
});

test('generateThemeJson outputs valid WordPress 6.x schema JSON', () => {
  const site = createFashionAgencySite();
  const jsonStr = generateThemeJson(site);
  const parsed = JSON.parse(jsonStr);

  assert.equal(parsed.version, 3);
  assert.equal(parsed.$schema, 'https://schemas.wp.org/trunk/theme.json');
  assert.ok(parsed.settings.color.palette.length > 0);
  assert.ok(parsed.settings.typography.fontFamilies.length > 0);
  assert.equal(parsed.settings.layout.contentSize, '840px');
});

test('createSiteFromPrompt parses custom requirements correctly', () => {
  const site = createSiteFromPrompt('Build a tech startup with Features, Pricing, and Blog pages');
  assert.ok(site.pages.some(p => p.slug === 'features'));
  assert.ok(site.pages.some(p => p.slug === 'pricing'));
  assert.ok(site.pages.some(p => p.slug === 'blog'));
  assert.ok(site.pages.some(p => p.slug === 'home'));
});
