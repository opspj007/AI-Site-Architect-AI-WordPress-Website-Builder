import React, { useState } from 'react';
import {
  Download,
  FileCode,
  FileArchive,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Terminal,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import type { WPSite } from '../../types/wordpress.ts';
import { generateWXRXml } from '../../lib/wordpress/wxrGenerator.ts';
import { generatePluginPhp } from '../../lib/wordpress/pluginGenerator.ts';
import { generateThemeJson } from '../../lib/wordpress/themeJsonGenerator.ts';

interface Props {
  site: WPSite;
}

export const ExportHub: React.FC<Props> = ({ site }) => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'php' | 'themeJson' | 'guide'>('downloads');
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [copiedPhp, setCopiedPhp] = useState(false);
  const [copiedThemeJson, setCopiedThemeJson] = useState(false);

  const phpCode = generatePluginPhp(site);
  const themeJson = generateThemeJson(site);
  const wxrXml = generateWXRXml(site);

  // Download WXR XML
  const handleDownloadWxr = () => {
    const blob = new Blob([wxrXml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-wordpress-export.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Plugin ZIP via backend
  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      const response = await fetch('/api/export/plugin-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site }),
      });

      if (!response.ok) throw new Error('ZIP generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-site-architect-${site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      // Fallback: download PHP file directly if zip fails
      const blob = new Blob([phpCode], { type: 'application/x-httpd-php;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-site-architect-${site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.php`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Download theme.json
  const handleDownloadThemeJson = () => {
    const blob = new Blob([themeJson], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPhp = () => {
    navigator.clipboard.writeText(phpCode);
    setCopiedPhp(true);
    setTimeout(() => setCopiedPhp(false), 2000);
  };

  const handleCopyThemeJson = () => {
    navigator.clipboard.writeText(themeJson);
    setCopiedThemeJson(true);
    setTimeout(() => setCopiedThemeJson(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Download className="w-6 h-6 text-emerald-500" />
          <span>WordPress Export & Deployment Hub</span>
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1">
          Deploy this AI-generated architecture to any local or production WordPress website.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-[#2c3338] gap-4">
        <button
          onClick={() => setActiveTab('downloads')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'downloads'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Download Packages
        </button>
        <button
          onClick={() => setActiveTab('php')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'php'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          ai-site-architect.php
        </button>
        <button
          onClick={() => setActiveTab('themeJson')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'themeJson'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          FSE theme.json
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'guide'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          3-Minute Setup Guide
        </button>
      </div>

      {/* Tab: Downloads */}
      {activeTab === 'downloads' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: WordPress Plugin ZIP */}
          <div className="bg-white dark:bg-[#1e2327] rounded-xl border border-neutral-200 dark:border-[#2c3338] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <FileArchive className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                Recommended
              </span>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                WordPress Plugin (.ZIP)
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Complete, self-activating WordPress plugin package. Bundles PHP CPT registrations,
                Gutenberg page creation hooks, theme.json, and readme.txt.
              </p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Auto-creates pages upon activation</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Registers CPTs: {site.customPostTypes.map((c) => c.pluralName).join(', ')}</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Configures Primary & Footer menus</li>
              </ul>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloadingZip}
              className="w-full py-2.5 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingZip ? 'Packaging Zip...' : 'Download Plugin (.ZIP)'}</span>
            </button>
          </div>

          {/* Card 2: Native WordPress WXR XML */}
          <div className="bg-white dark:bg-[#1e2327] rounded-xl border border-neutral-200 dark:border-[#2c3338] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                <FileCode className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                Native WP Core
              </span>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                WordPress WXR XML
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Official WordPress eXtended RSS (WXR 1.2) file. Compatible with standard
                <code className="text-emerald-500 font-mono"> Tools → Import → WordPress</code> on any WordPress installation.
              </p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Includes all {site.pages.length} pages & block markup</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> SEO Title & Meta Descriptions embedded</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Preserves nav menu linkages</li>
              </ul>
            </div>

            <button
              onClick={handleDownloadWxr}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download WXR (.XML)</span>
            </button>
          </div>

          {/* Card 3: Full Site Editing theme.json */}
          <div className="bg-white dark:bg-[#1e2327] rounded-xl border border-neutral-200 dark:border-[#2c3338] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-500 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">
                WordPress 6.x FSE
              </span>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Theme Tokens (theme.json)
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Modern Full Site Editing (FSE) configuration file. Defines brand color palettes,
                fluid typography scales, spacing tokens, and block presets.
              </p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" /> Schema v3 compliance</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" /> Palette: Primary, Secondary, Accent</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" /> Fonts: {site.theme.typography.fontHeading}</li>
              </ul>
            </div>

            <button
              onClick={handleDownloadThemeJson}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download theme.json</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: PHP Plugin File */}
      {activeTab === 'php' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-mono">
              ai-site-architect-{site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.php (Production Ready)
            </span>
            <button
              onClick={handleCopyPhp}
              className="px-3 py-1.5 bg-[#2271b1] text-white rounded text-xs flex items-center gap-1.5 cursor-pointer font-medium"
            >
              {copiedPhp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPhp ? 'Copied PHP!' : 'Copy PHP Source'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto max-h-[600px] border border-neutral-800 leading-relaxed">
            {phpCode}
          </pre>
        </div>
      )}

      {/* Tab: theme.json */}
      {activeTab === 'themeJson' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-mono">
              theme.json (WordPress 6.x FSE Specification)
            </span>
            <button
              onClick={handleCopyThemeJson}
              className="px-3 py-1.5 bg-[#2271b1] text-white rounded text-xs flex items-center gap-1.5 cursor-pointer font-medium"
            >
              {copiedThemeJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedThemeJson ? 'Copied JSON!' : 'Copy theme.json'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-neutral-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[600px] border border-neutral-800 leading-relaxed">
            {themeJson}
          </pre>
        </div>
      )}

      {/* Tab: 3-Minute Setup Guide */}
      {activeTab === 'guide' && (
        <div className="bg-white dark:bg-[#1e2327] rounded-xl border border-neutral-200 dark:border-[#2c3338] p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            How to Deploy to Any Real WordPress Site (3 Easy Steps)
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                  Method A: Install via Plugin ZIP (Instant Automated Setup)
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  Click <strong>Download Plugin (.ZIP)</strong> above. In your WordPress Dashboard, go to{' '}
                  <code className="text-[#2271b1] font-mono">Plugins → Add New → Upload Plugin</code>, select the zip file, and click <strong>Activate Plugin</strong>.
                  All pages, Gutenberg layouts, CPTs, and menus will be populated automatically!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                  Method B: Native WordPress WXR Import
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  Click <strong>Download WXR (.XML)</strong>. In your WordPress Dashboard, go to{' '}
                  <code className="text-emerald-600 font-mono">Tools → Import → WordPress</code>. If WordPress Importer is not yet installed, click Install Now then Run Importer. Select the XML file and submit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                  Apply Theme Styles (theme.json)
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  Place <code className="text-purple-600 font-mono">theme.json</code> in the root of your active block theme (e.g. <code className="font-mono">/wp-content/themes/twentytwentyfour/</code>) to instantly apply the editorial color palette, fonts, and fluid typography.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
