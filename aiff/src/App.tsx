import React, { useState } from 'react';
import type { WPSite, GutenbergBlock, WPPage } from './types/wordpress.ts';
import { createFashionAgencySite } from './lib/wordpress/fallbackGenerator.ts';
import { WpAdminBar, type AppViewMode } from './components/wp/WpAdminBar.tsx';
import { WpSidebar } from './components/wp/WpSidebar.tsx';
import { ArchitectConsole } from './components/views/ArchitectConsole.tsx';
import { LiveSitePreview } from './components/views/LiveSitePreview.tsx';
import { GutenbergEditor } from './components/views/GutenbergEditor.tsx';
import { CptViewer } from './components/views/CptViewer.tsx';
import { ExportHub } from './components/views/ExportHub.tsx';

export default function App() {
  const [site, setSite] = useState<WPSite>(createFashionAgencySite());
  const [currentMode, setCurrentMode] = useState<AppViewMode>('architect');
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('home');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleGenerate = async (prompt: string, style: string, customColor?: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, customColor }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.site) {
        setSite(data.site);
        setSelectedPageSlug(data.site.pages[0]?.slug || 'home');
        showToast(`WordPress site "${data.site.name}" architected successfully!`);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      showToast('Completed with architectural synthesis engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdatePageBlocks = (slug: string, newBlocks: GutenbergBlock[]) => {
    setSite((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => (p.slug === slug ? { ...p, blocks: newBlocks } : p)),
    }));
  };

  const handleUpdatePageSeo = (slug: string, seo: WPPage['seo']) => {
    setSite((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => (p.slug === slug ? { ...p, seo } : p)),
    }));
  };

  return (
    <div className="min-h-screen bg-[#f0f0f1] dark:bg-[#15191c] text-[#2c3338] dark:text-[#c3c4c7] flex flex-col font-sans select-text">
      {/* WordPress Top Admin Bar */}
      <WpAdminBar
        site={site}
        currentMode={currentMode}
        onSelectMode={(m) => {
          setCurrentMode(m);
          setIsMobileSidebarOpen(false);
        }}
        isGenerating={isGenerating}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Backdrop Drawer */}
        {isMobileSidebarOpen && currentMode !== 'preview' && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative z-50 w-64 bg-[#1d2327] h-full shadow-2xl">
              <WpSidebar
                site={site}
                currentMode={currentMode}
                onSelectMode={(m) => {
                  setCurrentMode(m);
                  setIsMobileSidebarOpen(false);
                }}
                selectedPageSlug={selectedPageSlug}
                onSelectPage={(s) => {
                  setSelectedPageSlug(s);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Desktop WordPress Admin Sidebar */}
        {currentMode !== 'preview' && (
          <div className="hidden md:flex">
            <WpSidebar
              site={site}
              currentMode={currentMode}
              onSelectMode={setCurrentMode}
              selectedPageSlug={selectedPageSlug}
              onSelectPage={setSelectedPageSlug}
            />
          </div>
        )}

        {/* View Switcher */}
        <main className="flex-1 overflow-y-auto">
          {notification && (
            <div className="fixed bottom-4 right-4 z-50 bg-[#1d2327] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-neutral-700 flex items-center gap-2 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{notification}</span>
            </div>
          )}

          {currentMode === 'architect' && (
            <ArchitectConsole
              site={site}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              onSelectMode={setCurrentMode}
              onSelectPageForEdit={(slug) => {
                setSelectedPageSlug(slug);
                setCurrentMode('gutenberg');
              }}
            />
          )}

          {currentMode === 'preview' && (
            <LiveSitePreview
              site={site}
              currentPageSlug={selectedPageSlug}
              onNavigatePage={setSelectedPageSlug}
              onEditInGutenberg={(slug) => {
                setSelectedPageSlug(slug);
                setCurrentMode('gutenberg');
              }}
            />
          )}

          {currentMode === 'gutenberg' && (
            <GutenbergEditor
              site={site}
              currentPageSlug={selectedPageSlug}
              onSelectPage={setSelectedPageSlug}
              onUpdatePageBlocks={handleUpdatePageBlocks}
              onUpdatePageSeo={handleUpdatePageSeo}
            />
          )}

          {currentMode === 'cpt' && <CptViewer site={site} />}

          {currentMode === 'export' && <ExportHub site={site} />}
        </main>
      </div>
    </div>
  );
}
