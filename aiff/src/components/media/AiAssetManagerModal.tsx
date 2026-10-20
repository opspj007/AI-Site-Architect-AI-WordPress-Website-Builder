import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  X,
  Wand2,
  Check,
  Copy,
  Layers,
  Palette,
  ExternalLink,
  Download,
  Ratio,
  RefreshCw,
} from 'lucide-react';
import type { AIAsset, WPThemePalette } from '../../types/wordpress.ts';
import { getInitialStockAssets } from '../../lib/wordpress/assetGenerator.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectAssetForBlock: (assetUrl: string) => void;
  targetBlockName?: string;
  palette?: WPThemePalette;
}

const STYLE_PRESETS = [
  { id: 'abstract-fluid', label: 'Abstract Fluid Waves', desc: 'Fluid algorithmic curves and ambient gradients' },
  { id: 'dark-luxury-gradient', label: 'Dark Luxury Gradient', desc: 'Deep black with champagne gold luminous accents' },
  { id: 'architectural-shadows', label: 'Architectural Shadows', desc: 'Minimalist cast shadows, light beams and concrete lines' },
  { id: 'geometric-minimal', label: 'Geometric Minimalist', desc: 'Precision concentric circles, grid marks and Swiss layout' },
  { id: 'editorial-haute', label: 'Haute Couture Studio', desc: 'Editorial studio lighting, draped silk and haute couture poise' },
];

const PROMPT_SUGGESTIONS = [
  'Minimalist beige and champagne gold fluid silk waves for editorial hero banner',
  'Dark luxury ambient gradient mesh with glowing bronze and amber accents',
  'Minimalist architectural shadows with diagonal light beams on smooth sandstone',
  'Haute couture studio lighting with soft ivory drapery and avant-garde silhouette',
  'Geometric minimalist concentric circles with Swiss grid layout and muted slate tones',
  'Warm terracotta and clay organic flowing fluid curve lines for artisan section banner',
];

export const AiAssetManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectAssetForBlock,
  targetBlockName = 'core/cover',
  palette,
}) => {
  const [assets, setAssets] = useState<AIAsset[]>(() => getInitialStockAssets());
  const [prompt, setPrompt] = useState(PROMPT_SUGGESTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState('abstract-fluid');
  const [selectedAspect, setSelectedAspect] = useState<'16:9' | '1:1' | '4:3' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'abstract' | 'editorial' | 'texture'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [appliedUrl, setAppliedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          aspectRatio: selectedAspect,
          palette,
        }),
      });

      if (!response.ok) throw new Error('Asset generation failed');

      const data = await response.json();
      if (data.asset) {
        setAssets((prev) => [data.asset, ...prev]);
        // Also auto-apply to current block for maximum fluidity
        handleApplyToBlock(data.asset.url);
      }
    } catch (err) {
      console.error('Failed to generate image asset:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToBlock = (url: string) => {
    onSelectAssetForBlock(url);
    setAppliedUrl(url);
    setTimeout(() => {
      setAppliedUrl(null);
    }, 2500);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredAssets = assets.filter((a) => {
    if (activeCategoryFilter === 'all') return true;
    return a.category === activeCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 font-sans animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#1e2327] rounded-xl shadow-2xl border border-neutral-200 dark:border-[#2c3338] flex flex-col max-h-[92vh] overflow-hidden z-10 text-neutral-800 dark:text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-[#2c3338] flex items-center justify-between bg-neutral-50 dark:bg-[#181c20]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  AI Asset Manager
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded border border-amber-400/30">
                  Imagen 3 Engine
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Generate high-resolution abstract art, gradients, and backgrounds for Gutenberg blocks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-mono text-neutral-400 mr-2">
              Target: <code className="text-blue-400 font-semibold">{targetBlockName}</code>
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Generation Section */}
          <div className="bg-neutral-50 dark:bg-[#15191c] rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-blue-500" />
                <span>Prompt Studio</span>
              </span>
              <span className="text-[11px] text-neutral-400">
                Generates responsive block backgrounds using Imagen 3
              </span>
            </div>

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your desired background image, abstract texture, or composition..."
                rows={2}
                className="w-full bg-white dark:bg-[#1c2125] border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-inner"
              />
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-neutral-400 font-medium block">
                Suggested Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_SUGGESTIONS.map((sugg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(sugg)}
                    className="text-[11px] px-2.5 py-1 rounded bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors truncate max-w-xs text-left"
                    title={sugg}
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls: Style and Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {/* Style selector */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  Art Style Preset:
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-white dark:bg-[#1c2125] border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {STYLE_PRESETS.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  Aspect Ratio:
                </label>
                <div className="flex gap-1.5">
                  {(['16:9', '1:1', '4:3', '9:16'] as const).map((asp) => (
                    <button
                      key={asp}
                      type="button"
                      onClick={() => setSelectedAspect(asp)}
                      className={`flex-1 py-1.5 rounded text-xs font-semibold border transition-colors ${
                        selectedAspect === asp
                          ? 'bg-[#2271b1] text-white border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-[#1c2125] text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {asp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-2 px-4 rounded-lg bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating with Imagen...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Generate Asset & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Media Library & Curated Assets */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-[#2c3338] pb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Generated Assets & Backgrounds ({filteredAssets.length})
                </h3>
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-1.5 text-xs">
                {(['all', 'abstract', 'editorial', 'texture'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                      activeCategoryFilter === cat
                        ? 'bg-[#2271b1] text-white font-semibold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-sm flex flex-col justify-between"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                    <img
                      src={asset.url}
                      alt={asset.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-amber-300 font-bold backdrop-blur-xs">
                        {asset.model}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-neutral-300 backdrop-blur-xs">
                        {asset.aspectRatio}
                      </span>
                    </div>
                  </div>

                  {/* Card Info & Actions */}
                  <div className="p-3 bg-white dark:bg-[#181c20] space-y-2 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2" title={asset.prompt}>
                      {asset.prompt}
                    </p>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyToBlock(asset.url)}
                        className={`flex-1 py-1.5 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          appliedUrl === asset.url
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#2271b1] hover:bg-[#135e96] text-white'
                        }`}
                      >
                        {appliedUrl === asset.url ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied to Block!</span>
                          </>
                        ) : (
                          <>
                            <Layers className="w-3.5 h-3.5" />
                            <span>Apply to Block</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyUrl(asset.url)}
                        className="p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Copy Data URL"
                      >
                        {copiedUrl === asset.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-[#2c3338] bg-neutral-50 dark:bg-[#181c20] flex items-center justify-between text-xs text-neutral-500">
          <span>
            Assets are saved to Gutenberg post_content attributes and exportable in WXR XML.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
