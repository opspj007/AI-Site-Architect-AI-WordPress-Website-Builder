import type { WPSite, WPPage, GutenbergBlock, WPCustomPostType, WPMenu, WPPluginRecommendation } from '../../types/wordpress.ts';

/**
 * Creates curated Gutenberg blocks for a modern fashion agency website
 */
export function createFashionAgencySite(): WPSite {
  const homeBlocks: GutenbergBlock[] = [
    {
      id: 'blk_cov_1',
      blockName: 'core/cover',
      attrs: {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80',
        dimRatio: 40,
        title: 'Modern Fashion Agency Editorial Hero',
      },
      innerBlocks: [
        {
          id: 'blk_grp_hero',
          blockName: 'core/group',
          attrs: {},
          innerBlocks: [
            {
              id: 'blk_hd_1',
              blockName: 'core/heading',
              attrs: { level: 1, textAlign: 'center', content: 'REDEFINING THE VISUAL LANGUAGE OF HIGH COUTURE' },
            },
            {
              id: 'blk_p_1',
              blockName: 'core/paragraph',
              attrs: { align: 'center', content: 'We orchestrate runway campaigns, bespoke brand identities, and editorial storytelling for visionary fashion houses worldwide.' },
            },
            {
              id: 'blk_btns_1',
              blockName: 'core/buttons',
              attrs: { layout: { justifyContent: 'center' } },
              innerBlocks: [
                {
                  id: 'blk_btn_1',
                  blockName: 'core/button',
                  attrs: { text: 'Explore Spring/Summer 2026', url: '/portfolio' },
                },
                {
                  id: 'blk_btn_2',
                  blockName: 'core/button',
                  attrs: { text: 'Book Runway Consultation', url: '/contact', className: 'is-style-outline' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'blk_sp_1',
      blockName: 'core/spacer',
      attrs: { height: '60px' },
    },
    {
      id: 'blk_hd_featured',
      blockName: 'core/heading',
      attrs: { level: 2, textAlign: 'center', content: 'THE AGENCY ETHOS' },
    },
    {
      id: 'blk_p_ethos',
      blockName: 'core/paragraph',
      attrs: { align: 'center', content: 'At Maison Atelier, we bridge Paris haute couture traditions with digital-first editorial aesthetics.' },
    },
    {
      id: 'blk_cols_features',
      blockName: 'core/columns',
      attrs: {},
      innerBlocks: [
        {
          id: 'blk_col_1',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_hd_col1', blockName: 'core/heading', attrs: { level: 3, content: '01 / Editorial Direction' } },
            { id: 'blk_p_col1', blockName: 'core/paragraph', attrs: { content: 'Conceptual direction, art casting, and global campaign photography for Paris, Milan, and New York fashion weeks.' } },
          ],
        },
        {
          id: 'blk_col_2',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_hd_col2', blockName: 'core/heading', attrs: { level: 3, content: '02 / Brand Architecture' } },
            { id: 'blk_p_col2', blockName: 'core/paragraph', attrs: { content: 'Visual identity, bespoke typography, luxury packaging design, and tactile publication craftsmanship.' } },
          ],
        },
        {
          id: 'blk_col_3',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_hd_col3', blockName: 'core/heading', attrs: { level: 3, content: '03 / Runway & Spatial' } },
            { id: 'blk_p_col3', blockName: 'core/paragraph', attrs: { content: 'Architectural runway set design, immersive soundscapes, and digital live-stream production.' } },
          ],
        },
      ],
    },
    {
      id: 'blk_sep_1',
      blockName: 'core/separator',
      attrs: {},
    },
    {
      id: 'blk_hd_gallery',
      blockName: 'core/heading',
      attrs: { level: 2, textAlign: 'center', content: 'SELECTED RUNWAY ARCHIVES' },
    },
    {
      id: 'blk_gal_1',
      blockName: 'core/gallery',
      attrs: { columns: 3 },
      innerBlocks: [
        { id: 'blk_img_1', blockName: 'core/image', attrs: { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', alt: 'Minimalist Monochrome Spring Look' } },
        { id: 'blk_img_2', blockName: 'core/image', attrs: { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', alt: 'Silk Drapery and Editorial Silhouette' } },
        { id: 'blk_img_3', blockName: 'core/image', attrs: { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', alt: 'Avant-garde Fashion Portrait' } },
      ],
    },
    {
      id: 'blk_quote_1',
      blockName: 'core/quote',
      attrs: {
        value: '“Maison Atelier redefined our international presence with effortless Parisian restraint and impeccable visual poise.”',
        citation: 'Elena Vance — Creative Director, Studio V',
      },
    },
  ];

  const aboutBlocks: GutenbergBlock[] = [
    {
      id: 'blk_ab_hd',
      blockName: 'core/heading',
      attrs: { level: 1, content: 'ABOUT MAISON ATELIER' },
    },
    {
      id: 'blk_ab_p1',
      blockName: 'core/paragraph',
      attrs: {
        dropCap: true,
        content: 'Founded in 2018 in the heart of Paris with studios in Tokyo and Milan, Maison Atelier is a creative agency built on the premise that fashion is architecture for the human spirit.',
      },
    },
    {
      id: 'blk_ab_cols',
      blockName: 'core/columns',
      attrs: {},
      innerBlocks: [
        {
          id: 'blk_ab_col_img',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            {
              id: 'blk_ab_img',
              blockName: 'core/image',
              attrs: {
                url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
                alt: 'Designers at work in fashion atelier',
                caption: 'The Paris Atelier, 4e Arrondissement',
              },
            },
          ],
        },
        {
          id: 'blk_ab_col_text',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_ab_hd2', blockName: 'core/heading', attrs: { level: 3, content: 'Our Philosophy' } },
            { id: 'blk_ab_p2', blockName: 'core/paragraph', attrs: { content: 'We refuse ephemeral noise. Every campaign, lookbook, and identity we craft is engineered to remain resonant across decades, fusing timeless silhouettes with fearless contemporary direction.' } },
            { id: 'blk_ab_list', blockName: 'core/list', attrs: { items: ['120+ International Fashion Campaigns', '8 Vogue & Harper’s Bazaar Covers', 'Offices in Paris, Tokyo, and New York', 'Sustainable & Carbon-Offset Production'] } },
          ],
        },
      ],
    },
  ];

  const servicesBlocks: GutenbergBlock[] = [
    {
      id: 'blk_serv_hd',
      blockName: 'core/heading',
      attrs: { level: 1, textAlign: 'center', content: 'BESPOKE AGENCY CAPABILITIES' },
    },
    {
      id: 'blk_serv_sub',
      blockName: 'core/paragraph',
      attrs: { align: 'center', content: 'Comprehensive creative consultancy for luxury apparel, haute joaillerie, and fragrance marques.' },
    },
    {
      id: 'blk_serv_cols',
      blockName: 'core/columns',
      attrs: {},
      innerBlocks: [
        {
          id: 'blk_serv_c1',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_s1_h', blockName: 'core/heading', attrs: { level: 3, content: 'Campaign Conception' } },
            { id: 'blk_s1_p', blockName: 'core/paragraph', attrs: { content: 'From seasonal storyboard to post-production color grading, we steer end-to-end campaign narratives.' } },
          ],
        },
        {
          id: 'blk_serv_c2',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_s2_h', blockName: 'core/heading', attrs: { level: 3, content: 'Runway & Presentation' } },
            { id: 'blk_s2_p', blockName: 'core/paragraph', attrs: { content: 'Scenography, lighting choreography, model casting, and high-fidelity global broadcasting.' } },
          ],
        },
        {
          id: 'blk_serv_c3',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_s3_h', blockName: 'core/heading', attrs: { level: 3, content: 'Digital Flagships' } },
            { id: 'blk_s3_p', blockName: 'core/paragraph', attrs: { content: 'Bespoke WooCommerce & headless digital storefronts engineered for ultra-luxury shopping experiences.' } },
          ],
        },
      ],
    },
  ];

  const portfolioBlocks: GutenbergBlock[] = [
    {
      id: 'blk_port_hd',
      blockName: 'core/heading',
      attrs: { level: 1, textAlign: 'center', content: 'THE ARCHIVE & PORTFOLIO' },
    },
    {
      id: 'blk_port_sub',
      blockName: 'core/paragraph',
      attrs: { align: 'center', content: 'Curated editorial commissions, runway collections, and couture brand launches.' },
    },
    {
      id: 'blk_port_gal',
      blockName: 'core/gallery',
      attrs: { columns: 2 },
      innerBlocks: [
        { id: 'blk_port_1', blockName: 'core/image', attrs: { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80', alt: 'Aura SS26 Campaign - Paris', caption: 'AURA SS26 // Paris Fashion Week' } },
        { id: 'blk_port_2', blockName: 'core/image', attrs: { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', alt: 'Silk & Shadows Autumn Lookbook', caption: 'SILK & SHADOWS // Editorial Lookbook' } },
        { id: 'blk_port_3', blockName: 'core/image', attrs: { url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80', alt: 'Luminescence Jewelry Campaign', caption: 'LUMINESCENCE // High Jewelry 2026' } },
        { id: 'blk_port_4', blockName: 'core/image', attrs: { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80', alt: 'Monolith Runway Scenography', caption: 'MONOLITH // Architectural Runway' } },
      ],
    },
  ];

  const contactBlocks: GutenbergBlock[] = [
    {
      id: 'blk_ct_hd',
      blockName: 'core/heading',
      attrs: { level: 1, textAlign: 'center', content: 'COMMISSION A PROJECT' },
    },
    {
      id: 'blk_ct_p',
      blockName: 'core/paragraph',
      attrs: { align: 'center', content: 'Our creative directors are available for seasonal campaigns, runway productions, and brand identity commissions.' },
    },
    {
      id: 'blk_ct_cols',
      blockName: 'core/columns',
      attrs: {},
      innerBlocks: [
        {
          id: 'blk_ct_info',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_ci_h', blockName: 'core/heading', attrs: { level: 3, content: 'Atelier Head Office' } },
            { id: 'blk_ci_p1', blockName: 'core/paragraph', attrs: { content: '24 Rue de Sévigné, 75004 Paris, France\nTelephone: +33 1 42 68 00 90\nEmail: contact@maisonatelier-fashion.com' } },
            { id: 'blk_ci_h2', blockName: 'core/heading', attrs: { level: 3, content: 'Press & Representation' } },
            { id: 'blk_ci_p2', blockName: 'core/paragraph', attrs: { content: 'press@maisonatelier-fashion.com\nInstagram: @maisonatelier' } },
          ],
        },
        {
          id: 'blk_ct_form',
          blockName: 'core/column',
          attrs: {},
          innerBlocks: [
            { id: 'blk_cf_h', blockName: 'core/heading', attrs: { level: 3, content: 'Send An Inquiry' } },
            { id: 'blk_cf_p', blockName: 'core/paragraph', attrs: { content: 'Please provide project timeframe, season, and scope of work.' } },
            {
              id: 'blk_cf_btns',
              blockName: 'core/buttons',
              attrs: {},
              innerBlocks: [
                { id: 'blk_cf_btn', blockName: 'core/button', attrs: { text: 'Transmit Brief to Creative Directors', url: 'mailto:contact@maisonatelier-fashion.com' } },
              ],
            },
          ],
        },
      ],
    },
  ];

  const pages: WPPage[] = [
    {
      id: 'page_home',
      title: 'Home',
      slug: 'home',
      isFrontPage: true,
      template: 'page-full-width',
      order: 1,
      seo: {
        metaTitle: 'Maison Atelier — Haute Couture & High Fashion Creative Agency',
        metaDescription: 'Parisian fashion agency specializing in runway direction, luxury campaigns, and editorial brand storytelling.',
        focusKeywords: ['fashion agency', 'couture campaign', 'runway direction', 'Paris fashion'],
        schemaType: 'Organization',
      },
      blocks: homeBlocks,
    },
    {
      id: 'page_about',
      title: 'About',
      slug: 'about',
      template: 'default',
      order: 2,
      seo: {
        metaTitle: 'About Maison Atelier — Our Paris Heritage & Design Ethos',
        metaDescription: 'Learn about our journey, atelier team, and international presence across Paris, Tokyo, and Milan.',
        focusKeywords: ['about fashion agency', 'Paris atelier', 'fashion team'],
        schemaType: 'AboutPage',
      },
      blocks: aboutBlocks,
    },
    {
      id: 'page_services',
      title: 'Services',
      slug: 'services',
      template: 'default',
      order: 3,
      seo: {
        metaTitle: 'Agency Services — Campaign Conception, Runway & Digital Flagships',
        metaDescription: 'Explore our comprehensive bespoke agency capabilities for luxury apparel and fashion houses.',
        focusKeywords: ['fashion services', 'runway production', 'lookbook photography'],
        schemaType: 'Service',
      },
      blocks: servicesBlocks,
    },
    {
      id: 'page_portfolio',
      title: 'Portfolio',
      slug: 'portfolio',
      template: 'page-full-width',
      order: 4,
      seo: {
        metaTitle: 'Runway & Editorial Portfolio — Maison Atelier Archives',
        metaDescription: 'Selected archives of international fashion week campaigns and couture collections.',
        focusKeywords: ['fashion portfolio', 'editorial photography', 'runway show archive'],
        schemaType: 'CollectionPage',
      },
      blocks: portfolioBlocks,
    },
    {
      id: 'page_contact',
      title: 'Contact',
      slug: 'contact',
      template: 'default',
      order: 5,
      seo: {
        metaTitle: 'Commission a Project — Contact Maison Atelier',
        metaDescription: 'Connect with our creative directors in Paris, Tokyo, and New York for your next seasonal collection.',
        focusKeywords: ['contact fashion agency', 'hire creative director', 'Paris office'],
        schemaType: 'ContactPage',
      },
      blocks: contactBlocks,
    },
  ];

  const customPostTypes: WPCustomPostType[] = [
    {
      slug: 'portfolio_item',
      singularName: 'Portfolio Project',
      pluralName: 'Portfolio Projects',
      description: 'Runway campaigns, editorial lookbooks, and luxury launches',
      icon: 'dashicons-portfolio',
      supports: ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
      hasArchive: true,
      fields: [
        { name: 'client_name', label: 'Client / Fashion House', type: 'text', defaultValue: 'Studio V Paris' },
        { name: 'season', label: 'Fashion Season', type: 'text', defaultValue: 'Spring/Summer 2026' },
        { name: 'category', label: 'Discipline', type: 'select', defaultValue: 'Runway Scenography' },
        { name: 'creative_director', label: 'Lead Creative Director', type: 'text', defaultValue: 'Camille Laurent' },
        { name: 'lookbook_count', label: 'Total Looks in Collection', type: 'number', defaultValue: 34 },
      ],
      sampleItems: [
        {
          title: 'AURA SS26 // Paris Fashion Week',
          slug: 'aura-ss26-paris',
          excerpt: 'Runway scenography and campaign lookbook for the minimalist couture collection.',
          customFields: { client_name: 'AURA Couture', season: 'SS26', category: 'Runway Scenography', lookbook_count: 42 },
        },
        {
          title: 'SILK & SHADOWS // Fall Editorial',
          slug: 'silk-and-shadows',
          excerpt: 'Monochrome lighting study and luxury knitwear lookbook shot in Normandy.',
          customFields: { client_name: 'Maison Noir', season: 'AW26', category: 'Editorial Photography', lookbook_count: 28 },
        },
        {
          title: 'LUMINESCENCE // High Jewelry 2026',
          slug: 'luminescence-jewelry',
          excerpt: 'Global print campaign and digital exhibition for fine emerald jewelry.',
          customFields: { client_name: 'Vance & Co.', season: 'Annual 2026', category: 'Luxury Brand Campaign', lookbook_count: 18 },
        },
      ],
    },
    {
      slug: 'agency_service',
      singularName: 'Agency Service',
      pluralName: 'Agency Services',
      description: 'Specialized creative capabilities and consulting packages',
      icon: 'dashicons-star-filled',
      supports: ['title', 'editor', 'thumbnail'],
      hasArchive: true,
      fields: [
        { name: 'deliverables_timeline', label: 'Delivery Timeline', type: 'text', defaultValue: '6-10 Weeks' },
        { name: 'starting_tier', label: 'Starting Investment', type: 'text', defaultValue: 'Contact for Consultation' },
      ],
      sampleItems: [
        { title: 'Global Campaign Direction', slug: 'global-campaign-direction', excerpt: 'Full seasonal campaign execution from moodboards to post-production.' },
        { title: 'Runway Show Scenography', slug: 'runway-scenography', excerpt: 'Immersive stagecraft, sound design, and live-stream curation.' },
      ],
    },
  ];

  const menus: WPMenu[] = [
    {
      name: 'Primary Navigation',
      location: 'primary',
      items: [
        { id: 'm_1', title: 'Home', url: '/', targetPageSlug: 'home' },
        { id: 'm_2', title: 'About', url: '/about', targetPageSlug: 'about' },
        { id: 'm_3', title: 'Services', url: '/services', targetPageSlug: 'services' },
        { id: 'm_4', title: 'Portfolio', url: '/portfolio', targetPageSlug: 'portfolio' },
        { id: 'm_5', title: 'Contact', url: '/contact', targetPageSlug: 'contact' },
      ],
    },
    {
      name: 'Footer Quick Links',
      location: 'footer',
      items: [
        { id: 'mf_1', title: 'Editorial Archives', url: '/portfolio' },
        { id: 'mf_2', title: 'Press Inquiries', url: '/contact' },
        { id: 'mf_3', title: 'Privacy Policy', url: '/privacy-policy' },
        { id: 'mf_4', title: 'Terms of Commission', url: '/terms' },
      ],
    },
  ];

  const recommendedPlugins: WPPluginRecommendation[] = [
    { name: 'Advanced Custom Fields (ACF)', slug: 'advanced-custom-fields', description: 'Power client names, runway metadata, and editorial field groups.', required: true, category: 'cpt' },
    { name: 'Rank Math SEO', slug: 'seo-by-rank-math', description: 'Advanced schema.org and rich snippet support for fashion lookbooks.', required: true, category: 'seo' },
    { name: 'WPForms Lite', slug: 'wpforms-lite', description: 'Elegant client inquiry forms and bespoke brief submissions.', required: true, category: 'forms' },
    { name: 'Smush Image Optimization', slug: 'wp-smushit', description: 'Lossless WebP compression for high-resolution fashion photography.', required: false, category: 'speed' },
  ];

  return {
    id: 'site_fashion_agency_01',
    name: 'Maison Atelier',
    tagline: 'High Fashion Creative Direction & Editorial Agency',
    description: 'A modern, editorial WordPress architecture crafted for fashion houses, runway directors, and haute couture agencies.',
    industry: 'Fashion, Luxury & Creative Direction',
    targetAudience: 'Fashion houses, luxury retailers, creative directors, and high-fashion publications',
    createdAt: new Date().toISOString(),
    theme: {
      styleName: 'Editorial Luxury',
      palette: {
        primary: '#121212',
        secondary: '#938274',
        accent: '#c5a880',
        background: '#faf9f6',
        surface: '#ffffff',
        text: '#171717',
        textMuted: '#737373',
      },
      typography: {
        fontHeading: 'Playfair Display, serif',
        fontBody: 'Plus Jakarta Sans, sans-serif',
        headingWeights: [400, 600, 700],
        bodyWeights: [400, 500],
        baseFontSize: '1rem',
        scaleRatio: 1.25,
      },
      borderRadius: '2px',
      contentSize: '840px',
      wideSize: '1320px',
    },
    pages,
    customPostTypes,
    taxonomies: [
      {
        slug: 'fashion_season',
        singularName: 'Season',
        pluralName: 'Seasons',
        hierarchical: true,
        associatedPostTypes: ['portfolio_item'],
        terms: ['Spring/Summer 2026', 'Autumn/Winter 2026', 'Resort Collection', 'Haute Couture'],
      },
      {
        slug: 'project_discipline',
        singularName: 'Discipline',
        pluralName: 'Disciplines',
        hierarchical: false,
        associatedPostTypes: ['portfolio_item'],
        terms: ['Runway Direction', 'Editorial Photography', 'Brand Identity', 'Film & Spatial'],
      },
    ],
    menus,
    recommendedPlugins,
    stats: {
      totalPages: 5,
      totalBlocks: 26,
      totalCPTs: 2,
      estimatedBuildHoursSaved: 38,
    },
  };
}

/**
 * Deterministic generator that parses natural language and creates customized WordPress sites
 */
export function createSiteFromPrompt(userPrompt: string, styleChoice?: string): WPSite {
  const promptLower = (userPrompt || '').toLowerCase();
  
  // If it matches fashion / agency or is default prompt, return high-polish fashion architecture
  if (promptLower.includes('fashion') || promptLower.includes('couture') || promptLower.includes('atelier')) {
    return createFashionAgencySite();
  }

  // Parse page requirements
  const requestedPages: string[] = [];
  const commonPages = ['Home', 'About', 'Services', 'Portfolio', 'Contact', 'Blog', 'Pricing', 'Features', 'Team', 'FAQ', 'Testimonials', 'Shop', 'Menu'];
  
  commonPages.forEach(p => {
    if (new RegExp(`\\b${p.toLowerCase()}\\b`, 'i').test(promptLower)) {
      requestedPages.push(p);
    }
  });

  if (requestedPages.length === 0) {
    requestedPages.push('Home', 'About', 'Services', 'Portfolio', 'Contact');
  } else if (!requestedPages.includes('Home')) {
    requestedPages.unshift('Home');
  }

  // Determine site name & industry
  let siteName = 'Omni Studio';
  let industry = 'Creative & Professional Services';
  let palette = {
    primary: '#0f172a',
    secondary: '#3b82f6',
    accent: '#10b981',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
  };

  if (promptLower.includes('tech') || promptLower.includes('saas') || promptLower.includes('software')) {
    siteName = 'Apex Tech Platform';
    industry = 'Technology & Software';
    palette = {
      primary: '#0f172a',
      secondary: '#2563eb',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f1f5f9',
      text: '#0f172a',
      textMuted: '#64748b',
    };
  } else if (promptLower.includes('bakery') || promptLower.includes('coffee') || promptLower.includes('restaurant') || promptLower.includes('cafe')) {
    siteName = 'Brioche & Bean Co.';
    industry = 'Food, Beverage & Hospitality';
    palette = {
      primary: '#451a03',
      secondary: '#b45309',
      accent: '#f59e0b',
      background: '#fdfbf7',
      surface: '#ffffff',
      text: '#292524',
      textMuted: '#78716c',
    };
  } else if (promptLower.includes('law') || promptLower.includes('legal') || promptLower.includes('finance')) {
    siteName = 'Sterling & Sterling Partners';
    industry = 'Legal & Financial Advisory';
    palette = {
      primary: '#1e293b',
      secondary: '#0f766e',
      accent: '#d97706',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textMuted: '#475569',
    };
  }

  const pages: WPPage[] = requestedPages.map((title, idx) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const isHome = idx === 0 || slug === 'home';

    const coverInnerBlocks: GutenbergBlock[] = [
      {
        id: `blk_${slug}_h1`,
        blockName: 'core/heading',
        attrs: { level: 1, textAlign: 'center', content: isHome ? `WELCOME TO ${siteName.toUpperCase()}` : title.toUpperCase() },
      },
      {
        id: `blk_${slug}_p1`,
        blockName: 'core/paragraph',
        attrs: { align: 'center', content: `Crafting bespoke, high-performance solutions for discerning clients across ${industry}.` },
      },
    ];

    if (isHome) {
      coverInnerBlocks.push({
        id: `blk_${slug}_btn`,
        blockName: 'core/buttons',
        attrs: { layout: { justifyContent: 'center' } },
        innerBlocks: [
          { id: `blk_${slug}_b1`, blockName: 'core/button', attrs: { text: 'Get Started Today', url: '/contact' } },
        ],
      });
    }

    const pageBlocks: GutenbergBlock[] = [
      {
        id: `blk_${slug}_cov`,
        blockName: 'core/cover',
        attrs: {
          url: isHome 
            ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80'
            : 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80',
          dimRatio: 50,
          title: `${title} Cover`,
        },
        innerBlocks: coverInnerBlocks,
      },
      {
        id: `blk_${slug}_h2`,
        blockName: 'core/heading',
        attrs: { level: 2, content: `Key Highlights & Insights` },
      },
      {
        id: `blk_${slug}_p2`,
        blockName: 'core/paragraph',
        attrs: {
          dropCap: true,
          content: `Our mission is grounded in deep craftsmanship and relentless dedication to quality. Every detail on our ${title.toLowerCase()} page reflects our continuous evolution.`,
        },
      },
      {
        id: `blk_${slug}_cols`,
        blockName: 'core/columns',
        attrs: {},
        innerBlocks: [
          {
            id: `blk_${slug}_c1`,
            blockName: 'core/column',
            attrs: {},
            innerBlocks: [
              { id: `blk_${slug}_ch1`, blockName: 'core/heading', attrs: { level: 3, content: 'Bespoke Strategy' } },
              { id: `blk_${slug}_cp1`, blockName: 'core/paragraph', attrs: { content: 'Tailored methodologies mapped directly to your core strategic objectives.' } },
            ],
          },
          {
            id: `blk_${slug}_c2`,
            blockName: 'core/column',
            attrs: {},
            innerBlocks: [
              { id: `blk_${slug}_ch2`, blockName: 'core/heading', attrs: { level: 3, content: 'Reliable Execution' } },
              { id: `blk_${slug}_cp2`, blockName: 'core/paragraph', attrs: { content: 'Decades of combined engineering and advisory expertise delivered on-schedule.' } },
            ],
          },
        ],
      },
    ];

    return {
      id: `page_${slug}_${idx}`,
      title,
      slug,
      isFrontPage: isHome,
      template: isHome ? 'page-full-width' : 'default',
      order: idx + 1,
      seo: {
        metaTitle: `${title} — ${siteName}`,
        metaDescription: `Discover our ${title.toLowerCase()} page at ${siteName}. Dedicated to professional excellence.`,
        focusKeywords: [title.toLowerCase(), siteName.toLowerCase(), industry.toLowerCase()],
        schemaType: isHome ? 'Organization' : 'WebPage',
      },
      blocks: pageBlocks,
    };
  });

  const menus: WPMenu[] = [
    {
      name: 'Primary Navigation',
      location: 'primary',
      items: pages.map((p, i) => ({
        id: `m_${p.slug}_${i}`,
        title: p.title,
        url: p.isFrontPage ? '/' : `/${p.slug}`,
        targetPageSlug: p.slug,
      })),
    },
    {
      name: 'Footer Navigation',
      location: 'footer',
      items: pages.slice(0, 4).map((p, i) => ({
        id: `mf_${p.slug}_${i}`,
        title: p.title,
        url: p.isFrontPage ? '/' : `/${p.slug}`,
      })),
    },
  ];

  return {
    id: `site_arch_${Date.now()}`,
    name: siteName,
    tagline: `Modern Architectural Structure for ${industry}`,
    description: `AI-synthesized WordPress site structure generated based on prompt: "${userPrompt}"`,
    industry,
    targetAudience: 'High-value clients, enterprise stakeholders, and consumers',
    createdAt: new Date().toISOString(),
    theme: {
      styleName: styleChoice || 'Modern Tech & Minimal',
      palette,
      typography: {
        fontHeading: 'Plus Jakarta Sans, sans-serif',
        fontBody: 'Inter, sans-serif',
        headingWeights: [600, 700],
        bodyWeights: [400, 500],
        baseFontSize: '1rem',
        scaleRatio: 1.25,
      },
      borderRadius: '8px',
      contentSize: '840px',
      wideSize: '1240px',
    },
    pages,
    customPostTypes: [
      {
        slug: 'case_study',
        singularName: 'Case Study',
        pluralName: 'Case Studies',
        description: 'Customer success stories, portfolio initiatives, and results',
        icon: 'dashicons-chart-area',
        supports: ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        hasArchive: true,
        fields: [
          { name: 'client_industry', label: 'Client Industry', type: 'text', defaultValue: industry },
          { name: 'impact_metric', label: 'Primary KPI Impact', type: 'text', defaultValue: '+142% Growth' },
        ],
        sampleItems: [
          { title: 'Enterprise Digital Transformation', slug: 'enterprise-transformation', excerpt: 'Comprehensive replatforming and performance optimization.' },
          { title: 'Global Brand Architecture Redesign', slug: 'global-brand-redesign', excerpt: 'New visual language and omnichannel design system rollout.' },
        ],
      },
    ],
    taxonomies: [
      {
        slug: 'industry_vertical',
        singularName: 'Vertical',
        pluralName: 'Verticals',
        hierarchical: true,
        associatedPostTypes: ['case_study'],
        terms: ['Enterprise', 'Mid-Market', 'Startup', 'Public Sector'],
      },
    ],
    menus,
    recommendedPlugins: [
      { name: 'Advanced Custom Fields', slug: 'advanced-custom-fields', description: 'Meta boxes and structured data.', required: true, category: 'cpt' },
      { name: 'Rank Math SEO', slug: 'seo-by-rank-math', description: 'Search optimization & schema markup.', required: true, category: 'seo' },
      { name: 'WPForms', slug: 'wpforms-lite', description: 'Contact and lead generation forms.', required: true, category: 'forms' },
    ],
    stats: {
      totalPages: pages.length,
      totalBlocks: pages.reduce((acc, p) => acc + p.blocks.length, 0),
      totalCPTs: 1,
      estimatedBuildHoursSaved: pages.length * 6 + 10,
    },
  };
}
