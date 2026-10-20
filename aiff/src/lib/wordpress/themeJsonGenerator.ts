import type { WPSite } from '../../types/wordpress.ts';

/**
 * Generates an official WordPress 6.x Full Site Editing (FSE) theme.json (version 3 schema).
 */
export function generateThemeJson(site: WPSite): string {
  const p = site.theme.palette;
  const t = site.theme.typography;

  const themeJson = {
    $schema: 'https://schemas.wp.org/trunk/theme.json',
    version: 3,
    title: `${site.name} Theme Tokens`,
    settings: {
      appearanceTools: true,
      layout: {
        contentSize: site.theme.contentSize || '840px',
        wideSize: site.theme.wideSize || '1280px',
      },
      color: {
        custom: true,
        defaultPalette: false,
        palette: [
          { slug: 'primary', color: p.primary, name: 'Brand Primary' },
          { slug: 'secondary', color: p.secondary, name: 'Brand Secondary' },
          { slug: 'accent', color: p.accent, name: 'Accent' },
          { slug: 'background', color: p.background, name: 'Background' },
          { slug: 'surface', color: p.surface, name: 'Surface Card' },
          { slug: 'text', color: p.text, name: 'Text Dark' },
          { slug: 'text-muted', color: p.textMuted, name: 'Text Muted' },
        ],
      },
      typography: {
        fluid: true,
        fontFamilies: [
          {
            fontFamily: t.fontHeading,
            name: 'Heading Font',
            slug: 'heading',
          },
          {
            fontFamily: t.fontBody,
            name: 'Body Font',
            slug: 'body',
          },
        ],
        fontSizes: [
          { size: '0.875rem', fluid: { min: '0.8rem', max: '0.875rem' }, slug: 'sm', name: 'Small' },
          { size: '1rem', fluid: { min: '0.95rem', max: '1rem' }, slug: 'base', name: 'Base' },
          { size: '1.25rem', fluid: { min: '1.1rem', max: '1.25rem' }, slug: 'md', name: 'Medium' },
          { size: '1.75rem', fluid: { min: '1.35rem', max: '1.75rem' }, slug: 'lg', name: 'Large' },
          { size: '2.5rem', fluid: { min: '1.8rem', max: '2.5rem' }, slug: 'xl', name: 'Extra Large' },
          { size: '3.5rem', fluid: { min: '2.4rem', max: '3.5rem' }, slug: '2xl', name: 'Huge' },
        ],
      },
      spacing: {
        units: ['px', 'em', 'rem', 'vh', 'vw', '%'],
        spacingScale: {
          operator: '*',
          increment: 1.5,
          steps: 7,
          mediumStep: 1.5,
          unit: 'rem',
        },
      },
      border: {
        radius: true,
        color: true,
        style: true,
        width: true,
      },
    },
    styles: {
      color: {
        background: 'var(--wp--preset--color--background)',
        text: 'var(--wp--preset--color--text)',
      },
      typography: {
        fontFamily: 'var(--wp--preset--font-family--body)',
        fontSize: 'var(--wp--preset--font-size--base)',
        lineHeight: '1.65',
      },
      elements: {
        heading: {
          typography: {
            fontFamily: 'var(--wp--preset--font-family--heading)',
            fontWeight: '700',
            lineHeight: '1.2',
          },
        },
        button: {
          border: {
            radius: site.theme.borderRadius || '8px',
          },
          color: {
            background: 'var(--wp--preset--color--primary)',
            text: '#ffffff',
          },
          spacing: {
            padding: {
              top: '0.85rem',
              bottom: '0.85rem',
              left: '1.75rem',
              right: '1.75rem',
            },
          },
        },
      },
    },
  };

  return JSON.stringify(themeJson, null, 2);
}
