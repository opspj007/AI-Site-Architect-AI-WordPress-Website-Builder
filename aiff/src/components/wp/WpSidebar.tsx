import React from 'react';
import {
  Sparkles,
  Layout,
  FileText,
  Briefcase,
  Layers,
  Palette,
  Plug,
  Settings,
  ChevronDown,
  Globe,
  Database,
  Download,
  FolderTree,
} from 'lucide-react';
import type { WPSite } from '../../types/wordpress.ts';
import type { AppViewMode } from './WpAdminBar.tsx';

interface Props {
  site: WPSite;
  currentMode: AppViewMode;
  onSelectMode: (mode: AppViewMode) => void;
  selectedPageSlug?: string;
  onSelectPage?: (slug: string) => void;
}

export const WpSidebar: React.FC<Props> = ({
  site,
  currentMode,
  onSelectMode,
  selectedPageSlug,
  onSelectPage,
}) => {
  const primaryCpt = site.customPostTypes?.[0];

  return (
    <aside className="w-56 bg-[#1d2327] text-[#c3c4c7] flex-shrink-0 flex flex-col justify-between select-none min-h-[calc(100vh-36px)] font-sans border-r border-[#2c3338] text-[13px]">
      <div className="py-2">
        {/* Plugin Main Section: AI Site Architect */}
        <div className="mb-2">
          <div
            onClick={() => onSelectMode('architect')}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
              currentMode === 'architect'
                ? 'bg-[#2271b1] text-white font-semibold'
                : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Site Architect</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
              AI
            </span>
          </div>

          {/* Submenus under AI Site Architect */}
          <div className="bg-[#15191c] py-1 text-xs">
            <button
              onClick={() => onSelectMode('architect')}
              className={`w-full text-left px-5 py-1.5 flex items-center justify-between ${
                currentMode === 'architect' ? 'text-white font-medium bg-[#1d2327]' : 'text-[#a7aaad] hover:text-[#72aee6]'
              }`}
            >
              <span>Architect Studio</span>
            </button>
            <button
              onClick={() => onSelectMode('gutenberg')}
              className={`w-full text-left px-5 py-1.5 flex items-center justify-between ${
                currentMode === 'gutenberg' ? 'text-white font-medium bg-[#1d2327]' : 'text-[#a7aaad] hover:text-[#72aee6]'
              }`}
            >
              <span>Gutenberg Block Editor</span>
            </button>
            <button
              onClick={() => onSelectMode('cpt')}
              className={`w-full text-left px-5 py-1.5 flex items-center justify-between ${
                currentMode === 'cpt' ? 'text-white font-medium bg-[#1d2327]' : 'text-[#a7aaad] hover:text-[#72aee6]'
              }`}
            >
              <span>Custom Post Types</span>
              <span className="text-[10px] bg-neutral-800 px-1 rounded">{site.customPostTypes?.length || 0}</span>
            </button>
            <button
              onClick={() => onSelectMode('export')}
              className={`w-full text-left px-5 py-1.5 flex items-center justify-between ${
                currentMode === 'export' ? 'text-white font-medium bg-[#1d2327]' : 'text-[#a7aaad] hover:text-[#72aee6]'
              }`}
            >
              <span>Export & WP Deploy</span>
              <Download className="w-3 h-3 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Core WordPress Menus */}
        <div className="space-y-0.5">
          {/* Pages */}
          <div className="group">
            <button
              onClick={() => onSelectMode('gutenberg')}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#2c3338] hover:text-[#72aee6] transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-[#a7aaad]" />
                <span>Pages</span>
              </div>
              <span className="text-[11px] bg-[#2c3338] text-[#c3c4c7] px-1.5 py-0.2 rounded-full">
                {site.pages?.length || 0}
              </span>
            </button>
            {/* Quick Page Jump List */}
            <div className="pl-9 pr-2 py-0.5 space-y-0.5">
              {(site.pages || []).map((page) => (
                <button
                  key={page.slug}
                  onClick={() => {
                    if (onSelectPage) onSelectPage(page.slug);
                    onSelectMode('gutenberg');
                  }}
                  className={`w-full text-left text-xs truncate py-1 px-1.5 rounded transition-colors ${
                    selectedPageSlug === page.slug && currentMode === 'gutenberg'
                      ? 'text-[#72aee6] font-medium bg-[#2c3338]'
                      : 'text-[#8c8f94] hover:text-white'
                  }`}
                >
                  {page.title} {page.isFrontPage ? '— Front' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic CPT Menu */}
          {primaryCpt && (
            <button
              onClick={() => onSelectMode('cpt')}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#2c3338] hover:text-[#72aee6] transition-colors ${
                currentMode === 'cpt' ? 'bg-[#2271b1] text-white font-semibold' : ''
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Briefcase className="w-4 h-4 text-[#a7aaad]" />
                <span>{primaryCpt.pluralName}</span>
              </div>
              <span className="text-[11px] bg-[#2c3338] text-[#c3c4c7] px-1.5 py-0.2 rounded-full">
                {primaryCpt.sampleItems?.length || 0}
              </span>
            </button>
          )}

          {/* Appearance / FSE Theme */}
          <button
            onClick={() => onSelectMode('architect')}
            className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#2c3338] hover:text-[#72aee6] transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <Palette className="w-4 h-4 text-[#a7aaad]" />
              <span>Appearance</span>
            </div>
            <span className="text-[10px] text-neutral-400">FSE</span>
          </button>

          {/* Plugins */}
          <button
            onClick={() => onSelectMode('export')}
            className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#2c3338] hover:text-[#72aee6] transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <Plug className="w-4 h-4 text-[#a7aaad]" />
              <span>Plugins</span>
            </div>
            <span className="text-[11px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded-full">
              {site.recommendedPlugins?.length || 4}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={() => onSelectMode('architect')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-left hover:bg-[#2c3338] hover:text-[#72aee6] transition-colors"
          >
            <Settings className="w-4 h-4 text-[#a7aaad]" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer info */}
      <div className="p-3 border-t border-[#2c3338] bg-[#15191c] text-[11px] space-y-1">
        <div className="flex items-center justify-between text-neutral-400">
          <span>Theme Style:</span>
          <span className="text-white font-medium">{site.theme?.styleName}</span>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>Gutenberg:</span>
          <span className="text-emerald-400">Active (v6.7)</span>
        </div>
        <div className="pt-2">
          <button
            onClick={() => onSelectMode('preview')}
            className="w-full py-1.5 px-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-center text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Globe className="w-3 h-3" />
            <span>View Live Site</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
