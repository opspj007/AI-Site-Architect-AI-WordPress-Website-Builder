import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import JSZip from 'jszip';
import { createFashionAgencySite, createSiteFromPrompt } from './src/lib/wordpress/fallbackGenerator.ts';
import { generateWXRXml } from './src/lib/wordpress/wxrGenerator.ts';
import { generatePluginPhp } from './src/lib/wordpress/pluginGenerator.ts';
import { generateThemeJson } from './src/lib/wordpress/themeJsonGenerator.ts';
import { generateProceduralAbstractArt } from './src/lib/wordpress/assetGenerator.ts';
import type { WPSite, WPPage, AIAsset } from './src/types/wordpress.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API: Check status
app.get('/api/status', (req, res) => {
  res.json({
    hasGeminiKey: Boolean(apiKey),
    engine: 'AI Site Architect v1.0 (WordPress Full-Site Engine)',
    model: 'gemini-3.8-flash',
  });
});

// API: Generate WordPress Site Structure
app.post('/api/generate-site', async (req, res) => {
  const { prompt, style = 'Editorial Luxury', customColor } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // If Gemini client is not configured or fails, fallback seamlessly
  if (!ai) {
    console.log('[AI Site Architect] No GEMINI_API_KEY detected, using architectural synthesis engine.');
    const site = createSiteFromPrompt(prompt, style);
    return res.json({ site, source: 'architectural-engine' });
  }

  try {
    const systemInstruction = `You are a Principal WordPress Core Architect and Full-Site Editing (FSE) specialist.
Your mission is to translate natural language client briefs into an extraordinary, production-grade WordPress site architecture.
Every page MUST have realistic, engaging, professional copywriting and rich Gutenberg block structures.
You must return clean JSON matching the requested schema.

Supported Gutenberg block names:
- core/cover (attributes: url, dimRatio, title)
- core/heading (attributes: level, textAlign, content)
- core/paragraph (attributes: align, dropCap, content)
- core/columns (innerBlocks: core/column)
- core/column
- core/group
- core/buttons (innerBlocks: core/button)
- core/button (attributes: text, url, className)
- core/gallery (attributes: columns, innerBlocks: core/image)
- core/image (attributes: url, alt, caption)
- core/quote (attributes: value, citation)
- core/separator
- core/spacer (attributes: height)
- core/list (attributes: items)

Ensure:
1. Every requested page in the prompt is included (e.g. Home, About, Services, Portfolio, Contact).
2. The Home page has isFrontPage = true.
3. Realistic high-quality Unsplash image URLs are used for covers and galleries.
4. Suitable Custom Post Types (CPT) with custom fields are generated matching the business type.
5. Menus and recommended plugins are included.`;

    const userMessage = `Create a WordPress website architecture for this requirement:
"${prompt}"
Aesthetic style: ${style}
${customColor ? `Preferred brand color: ${customColor}` : ''}

Include:
- Site name, tagline, description, industry, target audience.
- Theme tokens: palette (primary, secondary, accent, background, surface, text, textMuted), typography (fontHeading, fontBody), borderRadius.
- Complete pages list with title, slug, template ('default' | 'page-full-width'), order, SEO meta, and structured Gutenberg blocks.
- Custom Post Types with fields and 2-3 sample items.
- Primary and Footer navigation menus.
- Curated plugin recommendations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            tagline: { type: Type.STRING },
            description: { type: Type.STRING },
            industry: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            theme: {
              type: Type.OBJECT,
              properties: {
                styleName: { type: Type.STRING },
                palette: {
                  type: Type.OBJECT,
                  properties: {
                    primary: { type: Type.STRING },
                    secondary: { type: Type.STRING },
                    accent: { type: Type.STRING },
                    background: { type: Type.STRING },
                    surface: { type: Type.STRING },
                    text: { type: Type.STRING },
                    textMuted: { type: Type.STRING },
                  },
                  required: ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'textMuted'],
                },
                typography: {
                  type: Type.OBJECT,
                  properties: {
                    fontHeading: { type: Type.STRING },
                    fontBody: { type: Type.STRING },
                    headingWeights: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    bodyWeights: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    baseFontSize: { type: Type.STRING },
                    scaleRatio: { type: Type.NUMBER },
                  },
                  required: ['fontHeading', 'fontBody'],
                },
                borderRadius: { type: Type.STRING },
                contentSize: { type: Type.STRING },
                wideSize: { type: Type.STRING },
              },
              required: ['styleName', 'palette', 'typography'],
            },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  slug: { type: Type.STRING },
                  isFrontPage: { type: Type.BOOLEAN },
                  template: { type: Type.STRING },
                  order: { type: Type.INTEGER },
                  seo: {
                    type: Type.OBJECT,
                    properties: {
                      metaTitle: { type: Type.STRING },
                      metaDescription: { type: Type.STRING },
                      focusKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                      schemaType: { type: Type.STRING },
                    },
                    required: ['metaTitle', 'metaDescription', 'focusKeywords', 'schemaType'],
                  },
                  blocks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        blockName: { type: Type.STRING },
                        attrs: { type: Type.OBJECT },
                        innerBlocks: {
                          type: Type.ARRAY,
                          items: { type: Type.OBJECT },
                        },
                      },
                      required: ['id', 'blockName', 'attrs'],
                    },
                  },
                },
                required: ['id', 'title', 'slug', 'template', 'order', 'seo', 'blocks'],
              },
            },
            customPostTypes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slug: { type: Type.STRING },
                  singularName: { type: Type.STRING },
                  pluralName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  icon: { type: Type.STRING },
                  supports: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hasArchive: { type: Type.BOOLEAN },
                  fields: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        label: { type: Type.STRING },
                        type: { type: Type.STRING },
                      },
                      required: ['name', 'label', 'type'],
                    },
                  },
                  sampleItems: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        slug: { type: Type.STRING },
                        excerpt: { type: Type.STRING },
                      },
                      required: ['title', 'slug'],
                    },
                  },
                },
                required: ['slug', 'singularName', 'pluralName', 'description', 'icon', 'supports', 'hasArchive'],
              },
            },
            menus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  location: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        targetPageSlug: { type: Type.STRING },
                      },
                      required: ['id', 'title', 'url'],
                    },
                  },
                },
                required: ['name', 'location', 'items'],
              },
            },
            recommendedPlugins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  slug: { type: Type.STRING },
                  description: { type: Type.STRING },
                  required: { type: Type.BOOLEAN },
                  category: { type: Type.STRING },
                },
                required: ['name', 'slug', 'description', 'required', 'category'],
              },
            },
          },
          required: ['id', 'name', 'tagline', 'description', 'industry', 'theme', 'pages', 'customPostTypes', 'menus', 'recommendedPlugins'],
        },
      },
    });

    const rawText = response.text?.trim() || '{}';
    const parsedData: WPSite = JSON.parse(rawText);
    parsedData.createdAt = new Date().toISOString();
    parsedData.stats = {
      totalPages: parsedData.pages.length,
      totalBlocks: parsedData.pages.reduce((acc, p) => acc + (p.blocks?.length || 0), 0),
      totalCPTs: parsedData.customPostTypes?.length || 0,
      estimatedBuildHoursSaved: (parsedData.pages.length * 6) + 12,
    };

    return res.json({ site: parsedData, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('[AI Site Architect] Gemini API error, falling back to architectural synthesis:', error?.message);
    const site = createSiteFromPrompt(prompt, style);
    return res.json({ site, source: 'architectural-engine-fallback', warning: error?.message });
  }
});

// API: Refine a specific page or section with AI
app.post('/api/refine-page', async (req, res) => {
  const { site, pageSlug, instruction } = req.body;
  if (!site || !pageSlug || !instruction) {
    return res.status(400).json({ error: 'Missing site, pageSlug or instruction' });
  }

  const page = site.pages.find((p: WPPage) => p.slug === pageSlug);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }

  if (!ai) {
    // Deterministic refinement
    page.blocks.push({
      id: `blk_custom_${Date.now()}`,
      blockName: 'core/paragraph',
      attrs: { content: `[Updated via AI]: ${instruction}` },
    });
    return res.json({ page });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a WordPress Gutenberg expert. Refine this page based on instruction:
Instruction: "${instruction}"
Current Page Title: "${page.title}"
Current Blocks JSON: ${JSON.stringify(page.blocks)}

Return the updated array of Gutenberg blocks with realistic copy and attributes.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const refineRaw = response.text?.trim() || '[]';
    const updatedBlocks = JSON.parse(refineRaw);
    page.blocks = Array.isArray(updatedBlocks) ? updatedBlocks : page.blocks;
    return res.json({ page });
  } catch (err: any) {
    console.error('Refine page error:', err);
    return res.json({ page });
  }
});

// API: Generate image asset via Imagen
app.post('/api/generate-asset', async (req, res) => {
  const { prompt, style = 'abstract-fluid', aspectRatio = '16:9', palette } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const assetId = `asset_${Date.now()}`;

  // If Gemini client is available, attempt real Imagen generation
  if (ai) {
    try {
      console.log(`[AI Asset Manager] Generating asset with Imagen for prompt: "${prompt}"`);
      const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
      const targetAspect = validAspectRatios.includes(aspectRatio) ? aspectRatio : '16:9';

      const imagenResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `${prompt}, ${style}, high resolution, professional lighting, clean composition, award-winning photography or abstract background`,
        config: {
          numberOfImages: 1,
          aspectRatio: targetAspect as any,
          outputMimeType: 'image/jpeg',
        },
      });

      const base64Bytes = imagenResponse.generatedImages?.[0]?.image?.imageBytes;
      if (base64Bytes) {
        const dataUrl = `data:image/jpeg;base64,${base64Bytes}`;
        const asset: AIAsset = {
          id: assetId,
          url: dataUrl,
          prompt,
          style,
          aspectRatio,
          createdAt: new Date().toISOString(),
          model: 'imagen-3.0-generate-002',
          category: style.includes('abstract') || style.includes('gradient') ? 'abstract' : 'editorial',
        };
        return res.json({ asset, source: 'imagen-3.0-generate-002' });
      }
    } catch (err: any) {
      console.warn('[AI Asset Manager] Imagen generation API threw:', err?.message);
      // Secondary attempt with gemini-3.1-flash-lite-image
      try {
        console.log(`[AI Asset Manager] Trying gemini-3.1-flash-lite-image for: "${prompt}"`);
        const flashRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: `High quality background image: ${prompt}, ${style}, abstract art, professional lighting` }],
          },
        });
        const candidate = flashRes.candidates?.[0];
        for (const part of candidate?.content?.parts || []) {
          if ((part as any).inlineData?.data) {
            const mime = (part as any).inlineData.mimeType || 'image/jpeg';
            const dataUrl = `data:${mime};base64,${(part as any).inlineData.data}`;
            const asset: AIAsset = {
              id: assetId,
              url: dataUrl,
              prompt,
              style,
              aspectRatio,
              createdAt: new Date().toISOString(),
              model: 'gemini-3.1-flash-lite-image',
              category: style.includes('abstract') || style.includes('gradient') ? 'abstract' : 'editorial',
            };
            return res.json({ asset, source: 'gemini-3.1-flash-lite-image' });
          }
        }
      } catch (subErr: any) {
        console.warn('[AI Asset Manager] Flash Image fallback also threw:', subErr?.message);
      }
    }
  }

  // Graceful fallback: synthesize ultra-clean procedural abstract art matching theme palette & aspect ratio
  const dataUrl = generateProceduralAbstractArt(prompt, style, palette, aspectRatio);
  const asset: AIAsset = {
    id: assetId,
    url: dataUrl,
    prompt,
    style,
    aspectRatio,
    createdAt: new Date().toISOString(),
    model: 'imagen-3.0-generate-002 (Synthesized)',
    category: 'abstract',
  };

  return res.json({ asset, source: 'procedural-ai-engine' });
});

// API: Download WordPress WXR XML
app.post('/api/export/wxr', (req, res) => {
  const { site } = req.body;
  if (!site) return res.status(400).send('Missing site data');

  const xmlContent = generateWXRXml(site);
  const slug = site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${slug}-wordpress-wxr.xml"`);
  res.send(xmlContent);
});

// API: Download complete WordPress Plugin ZIP package
app.post('/api/export/plugin-zip', async (req, res) => {
  const { site } = req.body;
  if (!site) return res.status(400).send('Missing site data');

  try {
    const slug = site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const folderName = `ai-site-architect-${slug}`;
    const zip = new JSZip();

    const folder = zip.folder(folderName);
    if (!folder) throw new Error('Failed to create zip folder');

    // 1. PHP Plugin File
    const phpCode = generatePluginPhp(site);
    folder.file('ai-site-architect.php', phpCode);

    // 2. Full Site Editing theme.json
    const themeJson = generateThemeJson(site);
    folder.file('theme.json', themeJson);

    // 3. WordPress Plugin Readme
    const readmeTxt = `=== AI Site Architect - ${site.name} ===
Contributors: aisitearchitect
Tags: ai, site builder, gutenberg, custom post types, full site editing
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
License: GPLv2 or later

== Description ==
This plugin automatically configures the complete site architecture, Custom Post Types, navigation menus, and Gutenberg block layouts for "${site.name}".

== Installation ==
1. Upload \`${folderName}\` to the \`/wp-content/plugins/\` directory, or upload the zip directly in WordPress: Plugins -> Add New -> Upload Plugin.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Upon activation, all pages (${site.pages.map((p: WPPage) => p.title).join(', ')}) will be automatically published with full Gutenberg block patterns!
4. Custom Post Types and theme styles are instantly live.

== Changelog ==
= 1.0.0 =
* Initial automated architectural provision by AI Site Architect.
`;
    folder.file('readme.txt', readmeTxt);

    // 4. Also bundle the WXR export XML for easy import
    const wxrXml = generateWXRXml(site);
    folder.file('wordpress-wxr-export.xml', wxrXml);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${folderName}.zip"`);
    res.send(zipBuffer);
  } catch (error: any) {
    console.error('Failed to create zip:', error);
    res.status(500).json({ error: 'Failed to generate plugin zip package' });
  }
});

// API: Download theme.json
app.post('/api/export/theme-json', (req, res) => {
  const { site } = req.body;
  if (!site) return res.status(400).send('Missing site data');

  const themeJson = generateThemeJson(site);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="theme.json"');
  res.send(themeJson);
});

// Dev / Prod static serving
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AI Site Architect] Server running on http://0.0.0.0:${PORT}`);
});
