import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  Database,
  Code,
  Copy,
  Check,
  CheckCircle2,
  Tag,
  FileText,
} from 'lucide-react';
import type { WPSite, WPCustomPostType } from '../../types/wordpress.ts';

interface Props {
  site: WPSite;
}

export const CptViewer: React.FC<Props> = ({ site }) => {
  const [selectedCptSlug, setSelectedCptSlug] = useState<string>(
    site.customPostTypes?.[0]?.slug || ''
  );
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedCpt =
    site.customPostTypes.find((c) => c.slug === selectedCptSlug) || site.customPostTypes[0];

  const phpSnippet = selectedCpt
    ? `add_action('init', function() {
    register_post_type('${selectedCpt.slug}', array(
        'labels' => array(
            'name'          => __('${selectedCpt.pluralName}'),
            'singular_name' => __('${selectedCpt.singularName}'),
        ),
        'public'       => true,
        'has_archive'  => ${selectedCpt.hasArchive ? 'true' : 'false'},
        'menu_icon'    => '${selectedCpt.icon}',
        'supports'     => ${JSON.stringify(selectedCpt.supports)},
        'show_in_rest' => true, // Enables Gutenberg Editor
    ));
});`
    : '';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(phpSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-500" />
            <span>WordPress Custom Post Types & Schemas</span>
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">
            Registered CPTs with custom fields, taxonomies, and REST API support.
          </p>
        </div>
      </div>

      {/* CPT Selector Pills */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-[#2c3338] pb-3">
        {site.customPostTypes.map((cpt) => (
          <button
            key={cpt.slug}
            onClick={() => setSelectedCptSlug(cpt.slug)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              selectedCpt?.slug === cpt.slug
                ? 'bg-[#2271b1] text-white shadow-sm'
                : 'bg-white dark:bg-[#1e2327] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 border border-neutral-200 dark:border-[#2c3338]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{cpt.pluralName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
              {cpt.sampleItems?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {selectedCpt && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Details & Sample Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meta configuration card */}
            <div className="bg-white dark:bg-[#1e2327] rounded-lg border border-neutral-200 dark:border-[#2c3338] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {selectedCpt.pluralName} ({selectedCpt.slug})
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">{selectedCpt.description}</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Dashicon: {selectedCpt.icon}
                </span>
              </div>

              {/* Supported WP Core Features */}
              <div>
                <span className="text-xs text-neutral-400 block mb-2 font-medium">Supported Core Features:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedCpt.supports.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono"
                    >
                      ✓ {s}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
                    ✓ show_in_rest (Gutenberg)
                  </span>
                </div>
              </div>

              {/* Custom Fields (ACF Schema) */}
              {selectedCpt.fields && selectedCpt.fields.length > 0 && (
                <div className="pt-3 border-t border-neutral-100 dark:border-[#2c3338]">
                  <span className="text-xs text-neutral-400 block mb-2 font-medium">
                    Registered Custom Fields (ACF Schema):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedCpt.fields.map((f) => (
                      <div
                        key={f.name}
                        className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                            {f.label}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-400">
                            {f.name}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] uppercase font-bold text-neutral-600 dark:text-neutral-400">
                          {f.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sample CPT Entries */}
            <div className="bg-white dark:bg-[#1e2327] rounded-lg border border-neutral-200 dark:border-[#2c3338] p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Simulated WordPress Post Entries ({selectedCpt.sampleItems?.length || 0})</span>
              </h3>

              <div className="space-y-3">
                {(selectedCpt.sampleItems || []).map((item) => (
                  <div
                    key={item.slug}
                    className="p-4 rounded-lg bg-neutral-50 dark:bg-[#161a1d] border border-neutral-200 dark:border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">
                        /{selectedCpt.slug}/{item.slug}
                      </span>
                    </div>
                    {item.excerpt && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {item.excerpt}
                      </p>
                    )}
                    {item.customFields && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px]">
                        {Object.entries(item.customFields).map(([k, v]) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-neutral-700 dark:text-neutral-300"
                          >
                            {k}: <strong>{String(v)}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: PHP Registration Snippet */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e2327] rounded-lg border border-neutral-200 dark:border-[#2c3338] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-blue-500" />
                  <span>WordPress PHP Code</span>
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-3 bg-neutral-900 text-emerald-400 rounded font-mono text-[11px] overflow-x-auto leading-relaxed border border-neutral-800">
                {phpSnippet}
              </pre>
            </div>

            {/* Taxonomies Card */}
            <div className="bg-white dark:bg-[#1e2327] rounded-lg border border-neutral-200 dark:border-[#2c3338] p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>Associated Taxonomies</span>
              </h3>

              <div className="space-y-2">
                {site.taxonomies.map((tax) => (
                  <div
                    key={tax.slug}
                    className="p-3 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 text-xs"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold">{tax.pluralName}</span>
                      <span className="font-mono text-neutral-400">{tax.slug}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tax.terms.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
