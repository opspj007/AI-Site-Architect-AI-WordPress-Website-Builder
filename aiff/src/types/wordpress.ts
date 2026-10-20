export type GutenbergBlockName =
  | 'core/cover'
  | 'core/heading'
  | 'core/paragraph'
  | 'core/columns'
  | 'core/column'
  | 'core/group'
  | 'core/buttons'
  | 'core/button'
  | 'core/gallery'
  | 'core/image'
  | 'core/separator'
  | 'core/quote'
  | 'core/list'
  | 'core/table'
  | 'core/form'
  | 'core/query'
  | 'core/spacer';

export interface GutenbergBlock {
  id: string;
  blockName: GutenbergBlockName;
  attrs: Record<string, any>;
  innerBlocks?: GutenbergBlock[];
  innerHTML?: string;
}

export interface AIAsset {
  id: string;
  url: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  createdAt: string;
  model: string;
  category: 'abstract' | 'texture' | 'editorial' | 'gradient';
}

export interface WPPageSEO {
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  schemaType: string;
}

export interface WPPage {
  id: string;
  title: string;
  slug: string;
  isFrontPage?: boolean;
  isBlogPage?: boolean;
  parentSlug?: string | null;
  template: 'default' | 'page-full-width' | 'page-sidebar' | 'canvas';
  order: number;
  seo: WPPageSEO;
  blocks: GutenbergBlock[];
}

export interface WPCustomField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'image' | 'select' | 'url' | 'date';
  defaultValue?: string | number;
}

export interface WPCustomPostType {
  slug: string;
  singularName: string;
  pluralName: string;
  description: string;
  icon: string; // dashicon name, e.g. 'dashicons-portfolio'
  supports: string[]; // ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt']
  hasArchive: boolean;
  fields: WPCustomField[];
  sampleItems: Array<{
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    customFields?: Record<string, any>;
  }>;
}

export interface WPTaxonomy {
  slug: string;
  singularName: string;
  pluralName: string;
  hierarchical: boolean;
  associatedPostTypes: string[];
  terms: string[];
}

export interface WPMenuItem {
  id: string;
  title: string;
  url: string;
  targetPageSlug?: string;
  children?: WPMenuItem[];
}

export interface WPMenu {
  name: string;
  location: 'primary' | 'footer' | 'mobile';
  items: WPMenuItem[];
}

export interface WPThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export interface WPThemeTypography {
  fontHeading: string;
  fontBody: string;
  headingWeights: number[];
  bodyWeights: number[];
  baseFontSize: string;
  scaleRatio: number;
}

export interface WPThemeConfig {
  styleName: string;
  palette: WPThemePalette;
  typography: WPThemeTypography;
  borderRadius: string;
  contentSize: string;
  wideSize: string;
}

export interface WPPluginRecommendation {
  name: string;
  slug: string;
  description: string;
  required: boolean;
  category: 'core' | 'seo' | 'forms' | 'cpt' | 'speed' | 'ecommerce';
}

export interface WPSite {
  id: string;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  targetAudience: string;
  createdAt: string;
  theme: WPThemeConfig;
  pages: WPPage[];
  customPostTypes: WPCustomPostType[];
  taxonomies: WPTaxonomy[];
  menus: WPMenu[];
  recommendedPlugins: WPPluginRecommendation[];
  stats: {
    totalPages: number;
    totalBlocks: number;
    totalCPTs: number;
    estimatedBuildHoursSaved: number;
  };
}
