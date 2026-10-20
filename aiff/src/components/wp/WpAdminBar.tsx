import React from 'react';
import { Sparkles, Globe, Edit, Download, Home, MessageSquare, Plus, RefreshCw } from 'lucide-react';
import type { WPSite } from '../../types/wordpress.ts';

export type AppViewMode = 'architect' | 'preview' | 'gutenberg' | 'cpt' | 'export';

interface Props {
  site: WPSite;
  currentMode: AppViewMode;
  onSelectMode: (mode: AppViewMode) => void;
  isGenerating?: boolean;
  onToggleMobileMenu?: () => void;
}

export const WpAdminBar: React.FC<Props> = ({
  site,
  currentMode,
  onSelectMode,
  isGenerating = false,
  onToggleMobileMenu,
}) => {
  return (
    <header className="h-10 bg-[#1d2327] text-[#c3c4c7] text-xs flex items-center justify-between px-2 sm:px-3 select-none border-b border-[#2c3338] z-50 sticky top-0 shadow-sm font-sans">
      {/* Left controls: Mobile menu toggle, WP Logo & Site links */}
      <div className="flex items-center space-x-1 sm:space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded hover:bg-[#2c3338] text-white"
            title="Toggle WP Admin Menu"
          >
            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* WordPress Icon */}
        <div className="flex items-center space-x-1.5 px-1.5 py-1 hover:bg-[#2c3338] hover:text-white rounded cursor-pointer transition-colors">
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.504L5.617 12.33a5.534 5.534 0 0 1-.365-1.921c0-1.802 1.042-3.05 1.042-3.05s.964-.964 2.812-.964c.241 0 .522.04.843.08L6.42 16.32c1.446 1.486 3.454 2.42 5.58 2.42 1.365 0 2.65-.386 3.75-1.044l-3.376-9.78c.361-.04.683-.08.924-.08 1.847 0 2.811.964 2.811.964s1.044 1.248 1.044 3.05c0 .643-.16 1.325-.402 1.961l-3.232 9.177C18.675 20.672 22 16.732 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          <span className="font-semibold text-white hidden lg:inline">WordPress 6.7</span>
        </div>

        {/* Site Switcher */}
        <button
          onClick={() => onSelectMode('preview')}
          className="flex items-center space-x-1 px-2 py-1 hover:bg-[#2c3338] hover:text-white rounded transition-colors text-white font-medium"
          title="View Live Website Preview"
        >
          <Home className="w-3.5 h-3.5 text-blue-400" />
          <span className="truncate max-w-[130px] sm:max-w-[200px]">{site.name}</span>
        </button>

        {/* Comment count */}
        <div className="hidden sm:flex items-center space-x-1 px-2 py-1 hover:bg-[#2c3338] rounded cursor-pointer">
          <MessageSquare className="w-3 h-3 text-[#72aee6]" />
          <span>3</span>
        </div>

        {/* New Item */}
        <div className="hidden md:flex items-center space-x-1 px-2 py-1 hover:bg-[#2c3338] rounded cursor-pointer">
          <Plus className="w-3 h-3" />
          <span>New</span>
        </div>
      </div>

      {/* Center: Mode Navigation Switcher */}
      <div className="flex items-center bg-[#13171a] p-0.5 rounded border border-[#2c3338]">
        <button
          onClick={() => onSelectMode('architect')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
            currentMode === 'architect'
              ? 'bg-[#2271b1] text-white font-semibold shadow-sm'
              : 'text-[#c3c4c7] hover:text-white hover:bg-[#2c3338]'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>AI Site Architect</span>
          {isGenerating && <RefreshCw className="w-3 h-3 animate-spin text-white ml-1" />}
        </button>

        <button
          onClick={() => onSelectMode('preview')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
            currentMode === 'preview'
              ? 'bg-[#2271b1] text-white font-semibold shadow-sm'
              : 'text-[#c3c4c7] hover:text-white hover:bg-[#2c3338]'
          }`}
        >
          <Globe className="w-3 h-3 text-emerald-400" />
          <span className="hidden sm:inline">Live Site</span> Preview
        </button>

        <button
          onClick={() => onSelectMode('gutenberg')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
            currentMode === 'gutenberg'
              ? 'bg-[#2271b1] text-white font-semibold shadow-sm'
              : 'text-[#c3c4c7] hover:text-white hover:bg-[#2c3338]'
          }`}
        >
          <Edit className="w-3 h-3 text-sky-400" />
          <span className="hidden sm:inline">Gutenberg</span> Editor
        </button>

        <button
          onClick={() => onSelectMode('export')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
            currentMode === 'export'
              ? 'bg-[#2271b1] text-white font-semibold shadow-sm'
              : 'text-[#c3c4c7] hover:text-white hover:bg-[#2c3338]'
          }`}
        >
          <Download className="w-3 h-3 text-amber-400" />
          <span className="hidden sm:inline">Export &</span> Deploy
        </button>
      </div>

      {/* Right User profile */}
      <div className="flex items-center space-x-2">
        <span className="hidden lg:inline text-[#a7aaad]">Howdy,</span>
        <span className="text-white font-medium">Administrator</span>
        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
          WP
        </div>
      </div>
    </header>
  );
};
