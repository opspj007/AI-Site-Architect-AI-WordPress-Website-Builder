import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Edit,
  ArrowLeft,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';
import type { WPSite, WPPage } from '../../types/wordpress.ts';
import { GutenbergBlockRenderer } from '../blocks/GutenbergBlockRenderer.tsx';

interface Props {
  site: WPSite;
  currentPageSlug: string;
  onNavigatePage: (slug: string) => void;
  onEditInGutenberg: (slug: string) => void;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export const LiveSitePreview: React.FC<Props> = ({
  site,
  currentPageSlug,
  onNavigatePage,
  onEditInGutenberg,
}) => {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const activePage: WPPage =
    site.pages.find((p) => p.slug === currentPageSlug) || site.pages[0];

  const primaryMenu = site.menus.find((m) => m.location === 'primary') || site.menus[0];
  const footerMenu = site.menus.find((m) => m.location === 'footer') || site.menus[1];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[390px] shadow-2xl border-x border-neutral-300 dark:border-neutral-700';
      case 'tablet':
        return 'max-w-[768px] shadow-2xl border-x border-neutral-300 dark:border-neutral-700';
      default:
        return 'w-full shadow-lg';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-36px)] bg-neutral-100 dark:bg-[#121619] overflow-hidden">
      {/* Top Preview Bar: Viewport selector & Address Bar */}
      <div className="h-12 bg-white dark:bg-[#1e2327] border-b border-neutral-200 dark:border-[#2c3338] px-4 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigatePage(site.pages[0]?.slug || 'home')}
            className="text-xs font-semibold text-neutral-800 dark:text-white flex items-center gap-1.5 hover:text-[#2271b1]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Live WordPress Site Preview</span>
          </button>
        </div>

        {/* Browser Mock Address Bar */}
        <div className="hidden sm:flex items-center bg-neutral-100 dark:bg-[#121619] border border-neutral-200 dark:border-neutral-700 px-3 py-1 rounded-full text-xs text-neutral-600 dark:text-neutral-400 font-mono w-72 sm:w-96 truncate justify-center">
          <span className="text-emerald-500 mr-1.5">https://</span>
          <span>{site.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com/{activePage.slug === 'home' ? '' : activePage.slug}</span>
        </div>

        {/* Viewport controls & Edit action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-100 dark:bg-[#121619] p-0.5 rounded border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded transition-colors ${
                viewport === 'desktop' ? 'bg-white dark:bg-neutral-800 text-blue-600 shadow-xs' : 'text-neutral-500'
              }`}
              title="Desktop View (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded transition-colors ${
                viewport === 'tablet' ? 'bg-white dark:bg-neutral-800 text-blue-600 shadow-xs' : 'text-neutral-500'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded transition-colors ${
                viewport === 'mobile' ? 'bg-white dark:bg-neutral-800 text-blue-600 shadow-xs' : 'text-neutral-500'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onEditInGutenberg(activePage.slug)}
            className="px-3 py-1.5 rounded bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit in Gutenberg</span>
          </button>
        </div>
      </div>

      {/* Preview Screen Canvas container */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 flex justify-center bg-neutral-200/50 dark:bg-black/30">
        <div
          className={`${getViewportWidthClass()} min-h-full transition-all duration-300 flex flex-col`}
          style={{
            backgroundColor: site.theme.palette.background,
            color: site.theme.palette.text,
            fontFamily: site.theme.typography.fontBody,
          }}
        >
          {/* Rendered WordPress Header */}
          <header className="sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
            <div>
              <button
                onClick={() => onNavigatePage('home')}
                className="text-left group cursor-pointer"
              >
                <span
                  className="text-lg sm:text-xl font-bold tracking-tight block"
                  style={{ fontFamily: site.theme.typography.fontHeading }}
                >
                  {site.name}
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-500 tracking-wider uppercase block">
                  {site.tagline}
                </span>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
              {(primaryMenu?.items || []).map((item) => {
                const targetSlug = item.targetPageSlug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const isActive = activePage.slug === targetSlug;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigatePage(targetSlug)}
                    className={`py-1 px-2 rounded transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#2271b1] font-bold border-b-2 border-[#2271b1]'
                        : 'text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white'
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </nav>
          </header>

          {/* Rendered Page Content */}
          <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full">
            {/* Page title if not home */}
            {!activePage.isFrontPage && (
              <div className="mb-6 pb-4 border-b border-black/10 dark:border-white/10">
                <h1
                  className="text-3xl sm:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: site.theme.typography.fontHeading }}
                >
                  {activePage.title}
                </h1>
                <p className="text-xs text-neutral-500 mt-1">
                  WordPress Template: {activePage.template}
                </p>
              </div>
            )}

            {/* Gutenberg Blocks */}
            <div className="space-y-6">
              {activePage.blocks.map((block) => (
                <GutenbergBlockRenderer
                  key={block.id}
                  block={block}
                  theme={site.theme}
                  isEditable={false}
                />
              ))}
            </div>

            {/* If contact page, render interactive inquiry form */}
            {activePage.slug === 'contact' && (
              <div className="my-10 p-6 sm:p-8 rounded-xl bg-white dark:bg-neutral-800 border border-black/5 dark:border-white/10 shadow-lg max-w-2xl mx-auto">
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: site.theme.typography.fontHeading }}
                >
                  Live Contact Form Submission
                </h3>

                {contactSubmitted ? (
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2 animate-fadeIn">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Inquiry sent to site administrator! (Mock WordPress Mailer hook executed)</span>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Elena Vance"
                        className="w-full p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="elena@example.com"
                        className="w-full p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                        Project Brief or Message
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Describe your requirements, timeline, and vision..."
                        className="w-full p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      style={{ borderRadius: site.theme.borderRadius }}
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Brief</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </main>

          {/* Rendered WordPress Footer */}
          <footer className="mt-16 bg-neutral-900 text-neutral-400 px-6 sm:px-12 py-10 border-t border-neutral-800 text-xs">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-white font-bold text-sm">{site.name}</p>
                <p className="text-neutral-500 mt-0.5">{site.tagline}</p>
              </div>

              {/* Footer links */}
              <div className="flex flex-wrap items-center gap-4">
                {(footerMenu?.items || []).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.targetPageSlug) onNavigatePage(item.targetPageSlug);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-600">
              <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
              <span>Architected via AI Site Architect (WordPress 6.7)</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
