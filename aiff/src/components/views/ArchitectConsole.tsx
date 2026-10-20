import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Send,
  Layout,
  Layers,
  Clock,
  CheckCircle2,
  FileCode,
  Globe,
  Palette,
  Compass,
  Zap,
  BookOpen,
  Eye,
  Edit,
  ExternalLink,
} from 'lucide-react';
import type { WPSite, WPPage } from '../../types/wordpress.ts';
import type { AppViewMode } from '../wp/WpAdminBar.tsx';

interface Props {
  site: WPSite;
  isGenerating: boolean;
  onGenerate: (prompt: string, style: string, customColor?: string) => Promise<void>;
  onSelectMode: (mode: AppViewMode) => void;
  onSelectPageForEdit: (slug: string) => void;
}

const PRESET_PROMPTS = [
  {
    label: 'Modern Fashion Agency',
    prompt: 'Build a modern fashion agency website with Home, About, Services, Portfolio and Contact pages.',
    style: 'Editorial Luxury',
    tag: 'Fashion & Luxury',
    color: '#938274',
  },
  {
    label: 'B2B SaaS Tech Platform',
    prompt: 'Build a modern B2B SaaS startup website with Home, Features, Pricing, Documentation, and Contact pages with interactive product grids.',
    style: 'Modern Tech & Minimal',
    tag: 'SaaS & Enterprise',
    color: '#2563eb',
  },
  {
    label: 'Artisan Bakery & Cafe',
    prompt: 'Build a cozy artisan sourdough bakery and specialty coffee website with Home, Our Story, Menu, Catering, and Locations pages.',
    style: 'Warm Organic',
    tag: 'Hospitality',
    color: '#b45309',
  },
  {
    label: 'Luxury Boutique Hotel',
    prompt: 'Build a luxury boutique hotel and spa website with Home, Suites, Experiences, Dining, and Reservation Inquiry pages.',
    style: 'Editorial Luxury',
    tag: 'Travel & Luxury',
    color: '#0f766e',
  },
  {
    label: 'Architectural Design Studio',
    prompt: 'Build a minimalist architectural design studio website with Home, Philosophy, Selected Works, Studio Team, and Press pages.',
    style: 'Minimalist Clean',
    tag: 'Design & Architecture',
    color: '#18181b',
  },
];

const STYLE_OPTIONS = [
  { id: 'Editorial Luxury', label: 'Editorial Luxury (Playfair + Serif, High Contrast)' },
  { id: 'Modern Tech & Minimal', label: 'Modern Tech & Minimal (Plus Jakarta + Clean Lines)' },
  { id: 'Warm Organic', label: 'Warm Organic (Earth Tones, Tactile Typography)' },
  { id: 'Minimalist Clean', label: 'Minimalist Clean (Monochrome, Swiss Grid)' },
  { id: 'Creative Bold', label: 'Creative Bold (Neo-Brutalist, Punchy Colors)' },
];

export const ArchitectConsole: React.FC<Props> = ({
  site,
  isGenerating,
  onGenerate,
  onSelectMode,
  onSelectPageForEdit,
}) => {
  const [prompt, setPrompt] = useState(
    'Build a modern fashion agency website with Home, About, Services, Portfolio and Contact pages.'
  );
  const [selectedStyle, setSelectedStyle] = useState('Editorial Luxury');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [quickRefineInput, setQuickRefineInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerate(prompt, selectedStyle);
  };

  const handleApplyPreset = (item: typeof PRESET_PROMPTS[0]) => {
    setPrompt(item.prompt);
    setSelectedStyle(item.style);
  };

  const handleQuickRefine = async () => {
    if (!quickRefineInput.trim()) return;
    setIsRefining(true);
    try {
      await fetch('/api/refine-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site,
          pageSlug: site.pages[0]?.slug || 'home',
          instruction: quickRefineInput,
        }),
      });
      setQuickRefineInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-[#1d2327] to-neutral-900 text-white rounded-xl p-6 sm:p-8 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.504L5.617 12.33a5.534 5.534 0 0 1-.365-1.921c0-1.802 1.042-3.05 1.042-3.05s.964-.964 2.812-.964c.241 0 .522.04.843.08L6.42 16.32c1.446 1.486 3.454 2.42 5.58 2.42 1.365 0 2.65-.386 3.75-1.044l-3.376-9.78c.361-.04.683-.08.924-.08 1.847 0 2.811.964 2.811.964s1.044 1.248 1.044 3.05c0 .643-.16 1.325-.402 1.961l-3.232 9.177C18.675 20.672 22 16.732 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Site Architect v1.0 • WordPress Full-Site Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Turn Any Natural Language Prompt into a WordPress Website
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Enter your site concept below. AI Site Architect automatically synthesizes
            hierarchical pages, Gutenberg block patterns, Custom Post Types, navigation menus, and
            WordPress 6.x theme design tokens.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Build a modern fashion agency website with Home, About, Services, Portfolio and Contact pages."
              rows={3}
              className="w-full bg-[#121619] border border-neutral-700 rounded-lg p-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none shadow-inner"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white px-5 py-2 rounded-md font-medium text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Architecting Website...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Generate WordPress Site</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Controls: Presets & Style */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-400 font-medium">Quick Inspiration:</span>
              {PRESET_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/60 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="bg-[#121619] border border-neutral-700 text-neutral-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Live Generation Stepper Animation */}
        {isGenerating && (
          <div className="mt-6 pt-6 border-t border-neutral-800 animate-fadeIn">
            <div className="text-xs font-semibold text-amber-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>AI Core Generation in Progress...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {[
                '1. Information Architecture',
                '2. Gutenberg Block Synthesis',
                '3. CPT & Taxonomy Schemas',
                '4. Theme.json Design Tokens',
                '5. Compiling WXR & Plugin',
              ].map((step, idx) => (
                <div
                  key={step}
                  className="p-2.5 rounded bg-neutral-800/60 border border-neutral-700 text-[11px] text-neutral-300 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e2327] p-5 rounded-lg border border-neutral-200 dark:border-[#2c3338] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Published Pages</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {site.pages?.length || 5}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> FSE Template Mapped
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e2327] p-5 rounded-lg border border-neutral-200 dark:border-[#2c3338] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Gutenberg Blocks</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {site.stats?.totalBlocks || 26}
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              Covers, Columns, Galleries
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e2327] p-5 rounded-lg border border-neutral-200 dark:border-[#2c3338] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Custom Post Types</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {site.customPostTypes?.length || 2}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              Auto-registered in PHP
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileCode className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e2327] p-5 rounded-lg border border-neutral-200 dark:border-[#2c3338] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Dev Time Saved</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              ~{site.stats?.estimatedBuildHoursSaved || 38} hrs
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
              Full WP Architecture
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Site Architecture Tree + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive Sitemap & Page Explorer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-500" />
              <span>Information Architecture & Sitemap</span>
            </h2>
            <button
              onClick={() => onSelectMode('preview')}
              className="text-xs text-[#2271b1] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Preview Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white dark:bg-[#1e2327] rounded-lg border border-neutral-200 dark:border-[#2c3338] divide-y divide-neutral-100 dark:divide-[#2c3338] shadow-sm overflow-hidden">
            {site.pages.map((page, index) => (
              <div
                key={page.slug}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-[#252a30] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-7 h-7 rounded bg-[#2271b1]/10 text-[#2271b1] dark:text-[#72aee6] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 sm:mt-0">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-neutral-900 dark:text-white text-base">
                        {page.title}
                      </span>
                      {page.isFrontPage && (
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-semibold">
                          Front Page
                        </span>
                      )}
                      <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded font-mono">
                        /{page.slug}
                      </span>
                      <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded">
                        {page.template}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                      {page.seo.metaDescription || 'SEO metadata configured for WordPress Core'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <span className="text-xs text-neutral-400 font-mono hidden sm:inline mr-2">
                    {page.blocks.length} blocks
                  </span>
                  <button
                    onClick={() => {
                      onSelectPageForEdit(page.slug);
                      onSelectMode('gutenberg');
                    }}
                    className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-[#2271b1] hover:text-white text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Blocks</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectPageForEdit(page.slug);
                      onSelectMode('preview');
                    }}
                    className="px-2.5 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    title="View Page in Live Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Theme Design System & Fast Refinement */}
        <div className="space-y-6">
          {/* Design System Summary */}
          <div className="bg-white dark:bg-[#1e2327] rounded-lg border border-neutral-200 dark:border-[#2c3338] p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-500" />
              <span>Theme Design Tokens (theme.json)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-400 block mb-1">Color Palette (FSE Presets):</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-neutral-300 shadow-sm"
                    style={{ backgroundColor: site.theme.palette.primary }}
                    title={`Primary: ${site.theme.palette.primary}`}
                  />
                  <div
                    className="w-8 h-8 rounded border border-neutral-300 shadow-sm"
                    style={{ backgroundColor: site.theme.palette.secondary }}
                    title={`Secondary: ${site.theme.palette.secondary}`}
                  />
                  <div
                    className="w-8 h-8 rounded border border-neutral-300 shadow-sm"
                    style={{ backgroundColor: site.theme.palette.accent }}
                    title={`Accent: ${site.theme.palette.accent}`}
                  />
                  <div
                    className="w-8 h-8 rounded border border-neutral-300 shadow-sm"
                    style={{ backgroundColor: site.theme.palette.background }}
                    title={`Background: ${site.theme.palette.background}`}
                  />
                  <div
                    className="w-8 h-8 rounded border border-neutral-300 shadow-sm"
                    style={{ backgroundColor: site.theme.palette.surface }}
                    title={`Surface: ${site.theme.palette.surface}`}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-[#2c3338] space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Headings:</span>
                  <span className="font-serif font-medium text-neutral-800 dark:text-neutral-200">
                    {site.theme.typography.fontHeading}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Body Font:</span>
                  <span className="font-sans font-medium text-neutral-800 dark:text-neutral-200">
                    {site.theme.typography.fontBody}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Layout Max Width:</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">
                    {site.theme.wideSize || '1280px'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectMode('export')}
              className="w-full py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Inspect theme.json Schema</span>
            </button>
          </div>

          {/* Quick Refine with AI */}
          <div className="bg-white dark:bg-[#1e2327] rounded-lg border border-neutral-200 dark:border-[#2c3338] p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Architectural Copilot Refinement</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Want to tweak the structure? Ask the AI architect to inject sections, rewrite headings, or enhance block layouts.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={quickRefineInput}
                onChange={(e) => setQuickRefineInput(e.target.value)}
                placeholder="e.g. Add a 3-column pricing grid to Services"
                className="w-full bg-neutral-50 dark:bg-[#121619] border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleQuickRefine();
                }}
              />
              <button
                type="button"
                onClick={handleQuickRefine}
                disabled={isRefining || !quickRefineInput.trim()}
                className="w-full py-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                {isRefining ? (
                  <Sparkles className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                <span>Apply Architectural Refinement</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
