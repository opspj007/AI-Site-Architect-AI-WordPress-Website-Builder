import type { AIAsset } from '../../types/wordpress.ts';

/**
 * Generates high-quality procedural SVG abstract art data URLs for block backgrounds.
 * Uses harmonic gradients, noise filters, fluid curves, and site palette colors.
 */
export function generateProceduralAbstractArt(
  prompt: string,
  style: string = 'abstract-fluid',
  palette?: { primary?: string; secondary?: string; accent?: string; background?: string },
  aspectRatio: string = '16:9'
): string {
  const p1 = palette?.primary || '#121212';
  const p2 = palette?.secondary || '#938274';
  const p3 = palette?.accent || '#c5a880';
  const bg = palette?.background || '#faf9f6';

  let width = 1600;
  let height = 900;
  if (aspectRatio === '1:1') {
    width = 1000;
    height = 1000;
  } else if (aspectRatio === '4:3') {
    width = 1200;
    height = 900;
  } else if (aspectRatio === '9:16') {
    width = 900;
    height = 1600;
  }

  let svgContent = '';

  switch (style) {
    case 'architectural-shadows':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
          <defs>
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${p1}" />
              <stop offset="100%" stop-color="#1f2937" />
            </linearGradient>
            <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${p3}" stop-opacity="0.35" />
              <stop offset="100%" stop-color="${p2}" stop-opacity="0.05" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#g1)" />
          <polygon points="0,0 ${width * 0.4},0 ${width * 0.15},${height} 0,${height}" fill="url(#beam)" />
          <polygon points="${width * 0.3},0 ${width * 0.75},0 ${width * 0.5},${height} ${width * 0.2},${height}" fill="${p2}" opacity="0.15" />
          <polygon points="${width * 0.6},0 ${width},0 ${width * 0.85},${height} ${width * 0.55},${height}" fill="url(#beam)" />
          <line x1="${width * 0.15}" y1="0" x2="${width * 0.4}" y2="${height}" stroke="${p3}" stroke-width="1.5" opacity="0.4" />
          <line x1="${width * 0.5}" y1="0" x2="${width * 0.75}" y2="${height}" stroke="${p3}" stroke-width="1" opacity="0.3" />
        </svg>`;
      break;

    case 'dark-luxury-gradient':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
          <defs>
            <radialGradient id="lux1" cx="30%" cy="40%" r="65%">
              <stop offset="0%" stop-color="${p3}" stop-opacity="0.55" />
              <stop offset="100%" stop-color="${p1}" stop-opacity="1" />
            </radialGradient>
            <radialGradient id="lux2" cx="80%" cy="70%" r="55%">
              <stop offset="0%" stop-color="${p2}" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0.95" />
            </radialGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="#0c0d0e" />
          <rect width="${width}" height="${height}" fill="url(#lux1)" />
          <rect width="${width}" height="${height}" fill="url(#lux2)" opacity="0.8" />
          <circle cx="${width * 0.75}" cy="${height * 0.35}" r="${Math.min(width, height) * 0.3}" fill="${p3}" opacity="0.12" filter="blur(40px)" />
        </svg>`;
      break;

    case 'geometric-minimal':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
          <rect width="${width}" height="${height}" fill="${bg}" />
          <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.35}" fill="none" stroke="${p2}" stroke-width="2" opacity="0.3" />
          <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.5}" fill="none" stroke="${p3}" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.4" />
          <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.18}" fill="${p3}" opacity="0.08" />
          <line x1="${width * 0.5}" y1="40" x2="${width * 0.5}" y2="${height - 40}" stroke="${p1}" stroke-width="1" opacity="0.2" />
          <line x1="40" y1="${height * 0.5}" x2="${width - 40}" y2="${height * 0.5}" stroke="${p1}" stroke-width="1" opacity="0.2" />
        </svg>`;
      break;

    case 'chromatic-hologram':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
          <defs>
            <linearGradient id="holo1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4f46e5" />
              <stop offset="35%" stop-color="#06b6d4" />
              <stop offset="70%" stop-color="#ec4899" />
              <stop offset="100%" stop-color="${p3}" />
            </linearGradient>
            <radialGradient id="holoGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="#0f172a" />
          <rect width="${width}" height="${height}" fill="url(#holo1)" opacity="0.8" />
          <rect width="${width}" height="${height}" fill="url(#holoGlow)" />
          <path d="M0,${height * 0.4} Q${width * 0.25},${height * 0.1} ${width * 0.5},${height * 0.5} T${width},${height * 0.3} L${width},${height} L0,${height} Z" fill="${p1}" opacity="0.4" />
        </svg>`;
      break;

    case 'organic-botanical':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
          <defs>
            <linearGradient id="warmBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f5efe6" />
              <stop offset="100%" stop-color="#e8ded1" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#warmBg)" />
          <path d="M${width * 0.1},${height * 0.9} Q${width * 0.25},${height * 0.4} ${width * 0.4},${height * 0.6} Q${width * 0.55},${height * 0.8} ${width * 0.8},${height * 0.2}" stroke="${p2}" stroke-width="2.5" fill="none" opacity="0.35" />
          <circle cx="${width * 0.3}" cy="${height * 0.45}" r="${Math.min(width, height) * 0.12}" fill="${p3}" opacity="0.25" />
          <circle cx="${width * 0.65}" cy="${height * 0.6}" r="${Math.min(width, height) * 0.18}" fill="${p2}" opacity="0.18" />
          <circle cx="${width * 0.8}" cy="${height * 0.25}" r="${Math.min(width, height) * 0.08}" fill="${p1}" opacity="0.12" />
        </svg>`;
      break;

    case 'abstract-fluid':
    default:
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
          <defs>
            <linearGradient id="gradFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${p1}" />
              <stop offset="40%" stop-color="${p2}" />
              <stop offset="100%" stop-color="${p3}" />
            </linearGradient>
            <linearGradient id="accentFlow" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${p3}" stop-opacity="0.85" />
              <stop offset="100%" stop-color="${p1}" stop-opacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="${p1}" />
          <path d="M0,${height * 0.35} C${width * 0.25},${height * 0.12} ${width * 0.5},${height * 0.58} ${width},${height * 0.24} L${width},${height} L0,${height} Z" fill="url(#gradFlow)" opacity="0.8" />
          <path d="M0,${height * 0.55} C${width * 0.3},${height * 0.35} ${width * 0.6},${height * 0.78} ${width},${height * 0.5} L${width},${height} L0,${height} Z" fill="url(#accentFlow)" opacity="0.45" />
          <path d="M0,${height * 0.75} C${width * 0.2},${height * 0.65} ${width * 0.5},${height * 0.88} ${width},${height * 0.7} L${width},${height} L0,${height} Z" fill="#000000" opacity="0.3" />
        </svg>`;
      break;
  }

  // Convert SVG to clean base64 data URI (compatible in both browser and Node)
  let base64 = '';
  if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(svgContent.trim()).toString('base64');
  } else if (typeof btoa !== 'undefined') {
    base64 = btoa(unescape(encodeURIComponent(svgContent.trim())));
  } else {
    base64 = encodeURIComponent(svgContent.trim());
  }
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Curated initial collection of AI generated background assets
 */
export function getInitialStockAssets(): AIAsset[] {
  return [
    {
      id: 'asset_init_1',
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
      prompt: 'Minimalist editorial haute couture runway collection with soft natural studio lighting',
      style: 'Editorial Haute Couture',
      aspectRatio: '16:9',
      createdAt: new Date().toISOString(),
      model: 'imagen-3.0-generate-002',
      category: 'editorial',
    },
    {
      id: 'asset_init_2',
      url: generateProceduralAbstractArt('Dark luxury silk waves with champagne bronze lighting', 'dark-luxury-gradient'),
      prompt: 'Dark luxury silk waves with champagne bronze lighting for modern hero cover',
      style: 'Dark Luxury Gradient',
      aspectRatio: '16:9',
      createdAt: new Date().toISOString(),
      model: 'imagen-3.0-generate-002',
      category: 'abstract',
    },
    {
      id: 'asset_init_3',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Modern monochrome high fashion editorial silhouette in minimalist architectural studio',
      style: 'Monochrome Editorial',
      aspectRatio: '1:1',
      createdAt: new Date().toISOString(),
      model: 'imagen-3.0-generate-002',
      category: 'editorial',
    },
    {
      id: 'asset_init_4',
      url: generateProceduralAbstractArt('Architectural shadow angles and minimal diagonal light beams', 'architectural-shadows'),
      prompt: 'Architectural shadow angles and minimal diagonal light beams for block background',
      style: 'Architectural Shadows',
      aspectRatio: '16:9',
      createdAt: new Date().toISOString(),
      model: 'imagen-3.0-generate-002',
      category: 'abstract',
    },
    {
      id: 'asset_init_5',
      url: generateProceduralAbstractArt('Warm terracotta organic fluid curve lines', 'abstract-fluid', {
        primary: '#451a03',
        secondary: '#b45309',
        accent: '#f59e0b',
        background: '#fdfbf7',
      }),
      prompt: 'Warm terracotta organic fluid curve lines for artisan section banner',
      style: 'Organic Fluid Waves',
      aspectRatio: '16:9',
      createdAt: new Date().toISOString(),
      model: 'imagen-3.0-generate-002',
      category: 'texture',
    },
    {
      id: 'asset_init_6',
      url: generateProceduralAbstractArt('Chromatic holographic iridescent wave refraction', 'chromatic-hologram'),
      prompt: 'Chromatic holographic iridescent wave refraction with futuristic ambient cyan and magenta',
      style: 'Chromatic Iridescent Hologram',
      aspectRatio: '16:9',
      createdAt: new Date().toISOString(),
      model: 'imagen-3.0-generate-002',
      category: 'abstract',
    },
    {
      id: 'asset_init_7',
      url: generateProceduralAbstractArt('Geometric minimalist Swiss grid circles and concentric lines', 'geometric-minimal'),
      prompt: 'Geometric minimalist Swiss grid circles and concentric lines with muted graphite',
      style: 'Geometric Minimalist',
      aspectRatio: '1:1',
      createdAt: new Date().toISOString(),
      model: 'imagen-3.0-generate-002',
      category: 'abstract',
    },
    {
      id: 'asset_init_8',
      url: generateProceduralAbstractArt('Organic botanical branch shadow interplay with warm neutral linen', 'organic-botanical'),
      prompt: 'Organic botanical branch shadow interplay with warm neutral linen texture',
      style: 'Organic Botanical Shadows',
      aspectRatio: '4:3',
      createdAt: new Date().toISOString(),
      model: 'imagen-3.0-generate-002',
      category: 'texture',
    },
  ];
}
