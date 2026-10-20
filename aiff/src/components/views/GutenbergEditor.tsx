import React, { useState } from 'react';
import {
  Plus,
  Undo2,
  Redo2,
  Settings,
  Code,
  Eye,
  Check,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layout,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Columns,
  Quote,
  List,
  Sparkles,
} from 'lucide-react';
import type { WPSite, WPPage, GutenbergBlock, GutenbergBlockName } from '../../types/wordpress.ts';
import { GutenbergBlockRenderer } from '../blocks/GutenbergBlockRenderer.tsx';
import { serializePageBlocks } from '../../lib/wordpress/blockSerializer.ts';
import { AiAssetManagerModal } from '../media/AiAssetManagerModal.tsx';

interface Props {
  site: WPSite;
  currentPageSlug: string;
  onSelectPage: (slug: string) => void;
  onUpdatePageBlocks: (slug: string, newBlocks: GutenbergBlock[]) => void;
  onUpdatePageSeo: (slug: string, seo: WPPage['seo']) => void;
}

export const GutenbergEditor: React.FC<Props> = ({
  site,
  currentPageSlug,
  onSelectPage,
  onUpdatePageBlocks,
  onUpdatePageSeo,
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isCodeEditor, setIsCodeEditor] = useState<boolean>(false);
  const [showInserter, setShowInserter] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'block' | 'page'>('block');
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState<boolean>(false);

  const currentPage = site.pages.find((p) => p.slug === currentPageSlug) || site.pages[0];

  const selectedBlock = currentPage.blocks.find((b) => b.id === selectedBlockId);

  // Apply asset generated via Imagen to block
  const handleApplyAsset = (assetUrl: string) => {
    if (selectedBlock) {
      handleUpdateBlock({
        ...selectedBlock,
        attrs: { ...selectedBlock.attrs, url: assetUrl },
      });
    } else {
      // Find the first cover block on this page
      const coverIdx = currentPage.blocks.findIndex((b) => b.blockName === 'core/cover');
      if (coverIdx !== -1) {
        const newBlocks = [...currentPage.blocks];
        newBlocks[coverIdx] = {
          ...newBlocks[coverIdx],
          attrs: { ...newBlocks[coverIdx].attrs, url: assetUrl },
        };
        onUpdatePageBlocks(currentPage.slug, newBlocks);
      }
    }
  };

  // Update a block in state
  const handleUpdateBlock = (updated: GutenbergBlock) => {
    const newBlocks = currentPage.blocks.map((b) => (b.id === updated.id ? updated : b));
    onUpdatePageBlocks(currentPage.slug, newBlocks);
  };

  const handleDeleteBlock = (blockId: string) => {
    const newBlocks = currentPage.blocks.filter((b) => b.id !== blockId);
    onUpdatePageBlocks(currentPage.slug, newBlocks);
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const handleMoveUp = (blockId: string) => {
    const idx = currentPage.blocks.findIndex((b) => b.id === blockId);
    if (idx <= 0) return;
    const newBlocks = [...currentPage.blocks];
    const temp = newBlocks[idx - 1];
    newBlocks[idx - 1] = newBlocks[idx];
    newBlocks[idx] = temp;
    onUpdatePageBlocks(currentPage.slug, newBlocks);
  };

  const handleMoveDown = (blockId: string) => {
    const idx = currentPage.blocks.findIndex((b) => b.id === blockId);
    if (idx === -1 || idx >= currentPage.blocks.length - 1) return;
    const newBlocks = [...currentPage.blocks];
    const temp = newBlocks[idx + 1];
    newBlocks[idx + 1] = newBlocks[idx];
    newBlocks[idx] = temp;
    onUpdatePageBlocks(currentPage.slug, newBlocks);
  };

  const handleAddBlock = (blockName: GutenbergBlockName) => {
    const id = `blk_${Date.now()}`;
    let newBlock: GutenbergBlock;

    switch (blockName) {
      case 'core/heading':
        newBlock = {
          id,
          blockName: 'core/heading',
          attrs: { level: 2, content: 'New Section Heading', textAlign: 'left' },
        };
        break;
      case 'core/paragraph':
        newBlock = {
          id,
          blockName: 'core/paragraph',
          attrs: { content: 'Enter your new paragraph content here. Fully customizable.' },
        };
        break;
      case 'core/cover':
        newBlock = {
          id,
          blockName: 'core/cover',
          attrs: {
            url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
            dimRatio: 50,
            title: 'New Cover Hero',
          },
          innerBlocks: [
            {
              id: `${id}_h`,
              blockName: 'core/heading',
              attrs: { level: 2, textAlign: 'center', content: 'Hero Banner Title' },
            },
          ],
        };
        break;
      case 'core/buttons':
        newBlock = {
          id,
          blockName: 'core/buttons',
          attrs: { layout: { justifyContent: 'center' } },
          innerBlocks: [
            { id: `${id}_btn`, blockName: 'core/button', attrs: { text: 'Call to Action', url: '#' } },
          ],
        };
        break;
      case 'core/quote':
        newBlock = {
          id,
          blockName: 'core/quote',
          attrs: { value: '“Timeless elegance and refined simplicity.”', citation: 'Vogue Editorial' },
        };
        break;
      case 'core/separator':
        newBlock = { id, blockName: 'core/separator', attrs: {} };
        break;
      case 'core/list':
        newBlock = {
          id,
          blockName: 'core/list',
          attrs: { items: ['First strategic deliverable', 'Second key milestone', 'Third metric'] },
        };
        break;
      default:
        newBlock = {
          id,
          blockName: 'core/paragraph',
          attrs: { content: 'New block' },
        };
    }

    onUpdatePageBlocks(currentPage.slug, [...currentPage.blocks, newBlock]);
    setSelectedBlockId(id);
    setShowInserter(false);
  };

  const serializedHtml = serializePageBlocks(currentPage.blocks);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(serializedHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-36px)] bg-neutral-100 dark:bg-[#121619] overflow-hidden font-sans">
      {/* Top Gutenberg Toolbar */}
      <div className="h-14 bg-white dark:bg-[#1e2327] border-b border-neutral-200 dark:border-[#2c3338] px-4 flex items-center justify-between flex-shrink-0 z-30 shadow-xs">
        {/* Left Toolbar items: Inserter, Undo, Page selector */}
        <div className="flex items-center gap-2">
          {/* Block Inserter Button */}
          <div className="relative">
            <button
              onClick={() => setShowInserter(!showInserter)}
              className="w-8 h-8 rounded bg-[#1d2327] hover:bg-[#2c3338] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Add Block"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Inserter Dropdown Modal */}
            {showInserter && (
              <div className="absolute top-10 left-0 w-64 bg-white dark:bg-[#1e2327] border border-neutral-200 dark:border-[#2c3338] rounded-lg shadow-xl p-3 z-50 text-xs space-y-2 animate-fadeIn">
                <p className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">
                  Core Gutenberg Blocks
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleAddBlock('core/heading')}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left flex items-center gap-2"
                  >
                    <Type className="w-3.5 h-3.5 text-blue-500" />
                    <span>Heading</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('core/paragraph')}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left flex items-center gap-2"
                  >
                    <AlignLeft className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Paragraph</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('core/cover')}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left flex items-center gap-2"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                    <span>Cover</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('core/buttons')}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left flex items-center gap-2"
                  >
                    <Layout className="w-3.5 h-3.5 text-amber-500" />
                    <span>Buttons</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('core/quote')}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left flex items-center gap-2"
                  >
                    <Quote className="w-3.5 h-3.5 text-rose-500" />
                    <span>Quote</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('core/list')}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left flex items-center gap-2"
                  >
                    <List className="w-3.5 h-3.5 text-teal-500" />
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('core/separator')}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left flex items-center gap-2 col-span-2"
                  >
                    <span className="w-3.5 h-px bg-neutral-400 block" />
                    <span>Separator Line</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Page Switcher */}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-neutral-400 font-medium">Page:</span>
            <select
              value={currentPage.slug}
              onChange={(e) => onSelectPage(e.target.value)}
              className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {site.pages.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title} {p.isFrontPage ? '(Front Page)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Toolbar items: Mode toggle & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Asset Manager Button (Imagen 3) */}
          <button
            onClick={() => setIsAssetManagerOpen(true)}
            className="px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors cursor-pointer shadow-xs"
            title="Open AI Asset Manager (Imagen 3)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">AI Asset Manager</span>
            <span className="sm:hidden">Assets</span>
          </button>

          {/* Visual vs Code Editor Toggle */}
          <button
            onClick={() => setIsCodeEditor(!isCodeEditor)}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isCodeEditor
                ? 'bg-neutral-800 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {isCodeEditor ? (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Visual Editor</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>Code Editor (Gutenberg Markup)</span>
              </>
            )}
          </button>

          {/* WordPress Save/Publish Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3.5 h-3.5" />
            <span>Published</span>
          </div>
        </div>
      </div>

      {/* Main Area: Editor Canvas + Inspector Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 flex justify-center bg-white dark:bg-[#15191c]">
          <div className="w-full max-w-4xl space-y-6">
            {isCodeEditor ? (
              /* Code Editor View: Raw Gutenberg HTML Comments */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-mono">
                    Gutenberg Block Markup for post_content (WordPress Core format)
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Block Markup'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={serializedHtml}
                  rows={24}
                  className="w-full font-mono text-xs bg-neutral-900 text-emerald-400 p-4 rounded-lg border border-neutral-800 focus:outline-none shadow-inner leading-relaxed"
                />
              </div>
            ) : (
              /* Visual Gutenberg Canvas */
              <div className="space-y-6">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <input
                    type="text"
                    value={currentPage.title}
                    readOnly
                    className="text-4xl font-extrabold text-neutral-900 dark:text-white bg-transparent border-none focus:outline-none w-full"
                    placeholder="Add Page Title"
                    style={{ fontFamily: site.theme.typography.fontHeading }}
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Slug: /{currentPage.slug} • Template: {currentPage.template}
                  </p>
                </div>

                {currentPage.blocks.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                    <p className="text-neutral-500 text-sm mb-4">No blocks on this page yet.</p>
                    <button
                      onClick={() => handleAddBlock('core/heading')}
                      className="px-4 py-2 bg-[#2271b1] text-white rounded text-xs font-medium"
                    >
                      + Add Heading Block
                    </button>
                  </div>
                ) : (
                  currentPage.blocks.map((block) => (
                    <GutenbergBlockRenderer
                      key={block.id}
                      block={block}
                      theme={site.theme}
                      isSelected={selectedBlockId === block.id}
                      onSelect={(b) => setSelectedBlockId(b.id)}
                      onUpdate={handleUpdateBlock}
                      onDelete={handleDeleteBlock}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      isEditable={true}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Gutenberg Inspector */}
        <aside className="w-80 bg-white dark:bg-[#1e2327] border-l border-neutral-200 dark:border-[#2c3338] flex flex-col flex-shrink-0 z-10 text-xs">
          {/* Tab headers: Block vs Page */}
          <div className="flex border-b border-neutral-200 dark:border-[#2c3338]">
            <button
              onClick={() => setActiveTab('block')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'block'
                  ? 'border-b-2 border-[#2271b1] text-[#2271b1] font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Block Inspector
            </button>
            <button
              onClick={() => setActiveTab('page')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'page'
                  ? 'border-b-2 border-[#2271b1] text-[#2271b1] font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Page & SEO
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            {activeTab === 'block' ? (
              selectedBlock ? (
                /* Block Settings */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="font-bold text-neutral-800 dark:text-white capitalize">
                      {selectedBlock.blockName.replace('core/', '')} Block
                    </span>
                    <button
                      onClick={() => handleDeleteBlock(selectedBlock.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Heading Block Settings */}
                  {selectedBlock.blockName === 'core/heading' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-neutral-500 mb-1">Heading Level</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() =>
                                handleUpdateBlock({
                                  ...selectedBlock,
                                  attrs: { ...selectedBlock.attrs, level: lvl },
                                })
                              }
                              className={`flex-1 py-1 rounded border text-xs font-bold ${
                                (selectedBlock.attrs?.level || 2) === lvl
                                  ? 'bg-[#2271b1] text-white border-blue-600'
                                  : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300'
                              }`}
                            >
                              H{lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-500 mb-1">Text Alignment</label>
                        <div className="flex gap-1">
                          {(['left', 'center', 'right'] as const).map((al) => (
                            <button
                              key={al}
                              type="button"
                              onClick={() =>
                                handleUpdateBlock({
                                  ...selectedBlock,
                                  attrs: { ...selectedBlock.attrs, textAlign: al },
                                })
                              }
                              className={`flex-1 py-1 rounded border capitalize text-xs ${
                                (selectedBlock.attrs?.textAlign || 'left') === al
                                  ? 'bg-[#2271b1] text-white'
                                  : 'bg-neutral-50 dark:bg-neutral-800'
                              }`}
                            >
                              {al}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-500 mb-1">Content Text</label>
                        <textarea
                          rows={3}
                          value={selectedBlock.attrs?.content || ''}
                          onChange={(e) =>
                            handleUpdateBlock({
                              ...selectedBlock,
                              attrs: { ...selectedBlock.attrs, content: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Paragraph Block Settings */}
                  {selectedBlock.blockName === 'core/paragraph' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-neutral-500 mb-1">Paragraph Text</label>
                        <textarea
                          rows={4}
                          value={selectedBlock.attrs?.content || ''}
                          onChange={(e) =>
                            handleUpdateBlock({
                              ...selectedBlock,
                              attrs: { ...selectedBlock.attrs, content: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Drop Cap</span>
                        <input
                          type="checkbox"
                          checked={Boolean(selectedBlock.attrs?.dropCap)}
                          onChange={(e) =>
                            handleUpdateBlock({
                              ...selectedBlock,
                              attrs: { ...selectedBlock.attrs, dropCap: e.target.checked },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cover Block Settings */}
                  {selectedBlock.blockName === 'core/cover' && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-neutral-500 font-medium">Background Image</label>
                          <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Imagen 3
                          </span>
                        </div>

                        {selectedBlock.attrs?.url && (
                          <div className="relative aspect-video rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 mb-2">
                            <img
                              src={selectedBlock.attrs.url}
                              alt="Cover background"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsAssetManagerOpen(true)}
                          className="w-full py-2 px-3 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mb-2"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Background with Imagen</span>
                        </button>

                        <input
                          type="text"
                          value={selectedBlock.attrs?.url || ''}
                          placeholder="Image URL or data URI"
                          onChange={(e) =>
                            handleUpdateBlock({
                              ...selectedBlock,
                              attrs: { ...selectedBlock.attrs, url: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-500 mb-1">Overlay Opacity ({selectedBlock.attrs?.dimRatio || 50}%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedBlock.attrs?.dimRatio ?? 50}
                          onChange={(e) =>
                            handleUpdateBlock({
                              ...selectedBlock,
                              attrs: { ...selectedBlock.attrs, dimRatio: Number(e.target.value) },
                            })
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Block Settings */}
                  {selectedBlock.blockName === 'core/image' && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-neutral-500 font-medium">Image Asset</label>
                          <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Imagen 3
                          </span>
                        </div>

                        {selectedBlock.attrs?.url && (
                          <div className="relative aspect-video rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 mb-2">
                            <img
                              src={selectedBlock.attrs.url}
                              alt="Block image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsAssetManagerOpen(true)}
                          className="w-full py-2 px-3 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mb-2"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Art with Imagen</span>
                        </button>

                        <input
                          type="text"
                          value={selectedBlock.attrs?.url || ''}
                          placeholder="Image URL or data URI"
                          onChange={(e) =>
                            handleUpdateBlock({
                              ...selectedBlock,
                              attrs: { ...selectedBlock.attrs, url: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-500 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={selectedBlock.attrs?.alt || ''}
                          onChange={(e) =>
                            handleUpdateBlock({
                              ...selectedBlock,
                              attrs: { ...selectedBlock.attrs, alt: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-400 space-y-4">
                  <p>Click any block in the canvas to inspect its settings.</p>
                  <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2 text-left">
                    <span className="text-xs font-bold text-neutral-800 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Background Generator</span>
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Generate abstract art or editorial imagery with Imagen 3 and apply directly to your page hero or covers.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAssetManagerOpen(true)}
                      className="w-full py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open AI Asset Manager</span>
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* Page & SEO Settings */
              <div className="space-y-4">
                <div>
                  <label className="block text-neutral-500 mb-1">Page Template</label>
                  <select
                    value={currentPage.template}
                    disabled
                    className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs"
                  >
                    <option value="default">Default Template</option>
                    <option value="page-full-width">Full Width (No Sidebar)</option>
                    <option value="page-sidebar">Right Sidebar</option>
                    <option value="canvas">Blank Canvas</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                  <span className="font-bold text-neutral-800 dark:text-white block">
                    Yoast / RankMath SEO
                  </span>

                  <div>
                    <label className="block text-neutral-500 mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      value={currentPage.seo?.metaTitle || ''}
                      onChange={(e) =>
                        onUpdatePageSeo(currentPage.slug, {
                          ...currentPage.seo,
                          metaTitle: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={currentPage.seo?.metaDescription || ''}
                      onChange={(e) =>
                        onUpdatePageSeo(currentPage.slug, {
                          ...currentPage.seo,
                          metaDescription: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Focus Keywords</label>
                    <input
                      type="text"
                      value={(currentPage.seo?.focusKeywords || []).join(', ')}
                      onChange={(e) =>
                        onUpdatePageSeo(currentPage.slug, {
                          ...currentPage.seo,
                          focusKeywords: e.target.value.split(',').map((k) => k.trim()),
                        })
                      }
                      placeholder="e.g. fashion agency, paris"
                      className="w-full p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* AI Asset Manager Modal (Imagen 3) */}
      <AiAssetManagerModal
        isOpen={isAssetManagerOpen}
        onClose={() => setIsAssetManagerOpen(false)}
        onSelectAssetForBlock={handleApplyAsset}
        targetBlockName={selectedBlock?.blockName || 'core/cover'}
        palette={site.theme?.palette}
      />
    </div>
  );
};
