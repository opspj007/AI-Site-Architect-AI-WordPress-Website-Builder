import React from 'react';
import type { GutenbergBlock, WPThemeConfig } from '../../types/wordpress.ts';
import { ArrowUp, ArrowDown, Trash2, Edit3, Image as ImageIcon, Sparkles } from 'lucide-react';

interface Props {
  block: GutenbergBlock;
  theme?: WPThemeConfig;
  isSelected?: boolean;
  onSelect?: (block: GutenbergBlock) => void;
  onUpdate?: (updatedBlock: GutenbergBlock) => void;
  onDelete?: (blockId: string) => void;
  onMoveUp?: (blockId: string) => void;
  onMoveDown?: (blockId: string) => void;
  onOpenAssetManager?: (block: GutenbergBlock) => void;
  isEditable?: boolean;
}

export const GutenbergBlockRenderer: React.FC<Props> = ({
  block,
  theme,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onOpenAssetManager,
  isEditable = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onSelect) {
      e.stopPropagation();
      onSelect(block);
    }
  };

  const renderContent = () => {
    switch (block.blockName) {
      case 'core/cover': {
        const url = block.attrs?.url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80';
        const dimRatio = (block.attrs?.dimRatio ?? 40) / 100;

        return (
          <div
            className="relative w-full rounded-lg overflow-hidden my-4 min-h-[380px] flex items-center justify-center p-8 sm:p-14 text-white shadow-xl"
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              className="absolute inset-0 bg-black transition-opacity"
              style={{ opacity: dimRatio }}
            />
            <div className="relative z-10 w-full max-w-4xl text-center space-y-4">
              {(block.innerBlocks || []).map((inner) => (
                <GutenbergBlockRenderer
                  key={inner.id}
                  block={inner}
                  theme={theme}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onUpdate={onUpdate}
                  isEditable={isEditable}
                />
              ))}
            </div>
          </div>
        );
      }

      case 'core/group': {
        const bgUrl = block.attrs?.url;
        const dimRatio = (block.attrs?.dimRatio ?? 0) / 100;
        return (
          <div
            className={`relative w-full space-y-4 my-3 transition-all ${
              bgUrl ? 'p-6 sm:p-10 rounded-xl overflow-hidden shadow-lg text-white' : ''
            }`}
            style={
              bgUrl
                ? {
                    backgroundImage: `url(${bgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            {bgUrl && (
              <div
                className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                style={{ opacity: dimRatio > 0 ? dimRatio : 0.35 }}
              />
            )}
            <div className="relative z-10 w-full space-y-4">
              {(block.innerBlocks || []).map((inner) => (
                <GutenbergBlockRenderer
                  key={inner.id}
                  block={inner}
                  theme={theme}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onOpenAssetManager={onOpenAssetManager}
                  isEditable={isEditable}
                />
              ))}
            </div>
          </div>
        );
      }

      case 'core/heading': {
        const level = block.attrs?.level || 2;
        const align = block.attrs?.textAlign || 'left';
        const content = block.attrs?.content || block.innerHTML || 'Heading';

        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

        if (level === 1) {
          return (
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight ${alignClass}`}
              style={{ fontFamily: theme?.typography.fontHeading || 'inherit' }}
            >
              {content}
            </h1>
          );
        }
        if (level === 2) {
          return (
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${alignClass} mt-6 mb-3`}
              style={{ fontFamily: theme?.typography.fontHeading || 'inherit' }}
            >
              {content}
            </h2>
          );
        }
        return (
          <h3
            className={`text-xl sm:text-2xl font-semibold tracking-tight ${alignClass} mt-4 mb-2`}
            style={{ fontFamily: theme?.typography.fontHeading || 'inherit' }}
          >
            {content}
          </h3>
        );
      }

      case 'core/paragraph': {
        const content = block.attrs?.content || block.innerHTML || '';
        const align = block.attrs?.align || 'left';
        const dropCap = block.attrs?.dropCap;
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

        return (
          <p
            className={`text-base sm:text-lg leading-relaxed text-inherit opacity-90 ${alignClass} ${dropCap ? 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none' : ''}`}
            style={{ fontFamily: theme?.typography.fontBody || 'inherit' }}
          >
            {content}
          </p>
        );
      }

      case 'core/columns': {
        const count = block.innerBlocks?.length || 1;
        const colClasses: Record<number, string> = {
          1: 'grid-cols-1',
          2: 'grid-cols-1 md:grid-cols-2',
          3: 'grid-cols-1 md:grid-cols-3',
          4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        };

        return (
          <div className={`grid ${colClasses[count] || 'grid-cols-1 md:grid-cols-3'} gap-6 my-6 w-full`}>
            {(block.innerBlocks || []).map((col) => (
              <GutenbergBlockRenderer
                key={col.id}
                block={col}
                theme={theme}
                isSelected={isSelected}
                onSelect={onSelect}
                onUpdate={onUpdate}
                isEditable={isEditable}
              />
            ))}
          </div>
        );
      }

      case 'core/column': {
        return (
          <div className="flex flex-col space-y-3 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {(block.innerBlocks || []).map((inner) => (
              <GutenbergBlockRenderer
                key={inner.id}
                block={inner}
                theme={theme}
                isSelected={isSelected}
                onSelect={onSelect}
                onUpdate={onUpdate}
                isEditable={isEditable}
              />
            ))}
          </div>
        );
      }

      case 'core/buttons': {
        const justify = block.attrs?.layout?.justifyContent || 'center';
        const justifyClass = justify === 'center' ? 'justify-center' : justify === 'right' ? 'justify-end' : 'justify-start';

        return (
          <div className={`flex flex-wrap items-center gap-4 my-4 ${justifyClass}`}>
            {(block.innerBlocks || []).map((inner) => (
              <GutenbergBlockRenderer
                key={inner.id}
                block={inner}
                theme={theme}
                isSelected={isSelected}
                onSelect={onSelect}
                onUpdate={onUpdate}
                isEditable={isEditable}
              />
            ))}
          </div>
        );
      }

      case 'core/button': {
        const text = block.attrs?.text || 'Explore More';
        const isOutline = block.attrs?.className?.includes('is-style-outline');

        return (
          <button
            type="button"
            className={`px-6 py-3 rounded text-sm sm:text-base font-medium transition-all shadow-sm ${
              isOutline
                ? 'border-2 border-current bg-transparent hover:bg-white/10'
                : 'bg-white text-black hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white'
            }`}
            style={{
              borderRadius: theme?.borderRadius || '4px',
            }}
          >
            {text}
          </button>
        );
      }

      case 'core/gallery': {
        const columns = block.attrs?.columns || 3;
        const gridCols: Record<number, string> = {
          2: 'grid-cols-1 sm:grid-cols-2',
          3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
          4: 'grid-cols-2 md:grid-cols-4',
        };

        return (
          <div className={`grid ${gridCols[columns] || 'grid-cols-3'} gap-4 my-6 w-full`}>
            {(block.innerBlocks || []).map((imgBlock) => (
              <GutenbergBlockRenderer
                key={imgBlock.id}
                block={imgBlock}
                theme={theme}
                isSelected={isSelected}
                onSelect={onSelect}
                onUpdate={onUpdate}
                isEditable={isEditable}
              />
            ))}
          </div>
        );
      }

      case 'core/image': {
        const url = block.attrs?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
        const alt = block.attrs?.alt || 'Editorial Image';
        const caption = block.attrs?.caption;

        return (
          <figure className="group relative overflow-hidden rounded-lg border border-black/10 dark:border-white/10 shadow-sm">
            <img
              src={url}
              alt={alt}
              className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {caption && (
              <figcaption className="p-2 text-xs text-center text-neutral-500 bg-neutral-50 dark:bg-neutral-900/80">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      }

      case 'core/quote': {
        const val = block.attrs?.value || block.innerHTML || 'Quote';
        const cite = block.attrs?.citation;

        return (
          <blockquote className="my-6 pl-6 border-l-4 border-amber-600 italic space-y-2">
            <p className="text-lg sm:text-xl font-serif text-neutral-800 dark:text-neutral-200">
              {val}
            </p>
            {cite && (
              <cite className="block text-sm not-italic font-sans text-neutral-500 dark:text-neutral-400">
                — {cite}
              </cite>
            )}
          </blockquote>
        );
      }

      case 'core/list': {
        const items: string[] = block.attrs?.items || ['Feature item 1', 'Feature item 2'];
        return (
          <ul className="list-disc pl-6 space-y-1.5 my-3 text-neutral-700 dark:text-neutral-300">
            {items.map((it, idx) => (
              <li key={idx} className="text-sm sm:text-base">{it}</li>
            ))}
          </ul>
        );
      }

      case 'core/separator': {
        return <hr className="my-8 border-t border-neutral-300 dark:border-neutral-700" />;
      }

      case 'core/spacer': {
        const height = block.attrs?.height || '40px';
        return <div style={{ height }} aria-hidden="true" />;
      }

      default: {
        return (
          <div className="p-4 my-2 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-mono">
            [{block.blockName}] {JSON.stringify(block.attrs)}
          </div>
        );
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group transition-all duration-150 ${
        isEditable ? 'cursor-pointer hover:ring-2 hover:ring-blue-500/50 rounded-sm' : ''
      } ${isSelected ? 'ring-2 ring-blue-600 bg-blue-500/5' : ''}`}
    >
      {/* Visual Gutenberg hover controls when in editor mode */}
      {isEditable && isSelected && (
        <div className="absolute -top-9 left-2 z-30 flex items-center gap-1 bg-neutral-900 text-white text-xs px-2 py-1 rounded shadow-lg border border-neutral-700 animate-fadeIn">
          <span className="font-semibold text-blue-400 flex items-center gap-1">
            <Edit3 className="w-3 h-3" />
            {block.blockName.replace('core/', '')}
          </span>
          <div className="h-3 w-px bg-neutral-700 mx-1" />
          {onMoveUp && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveUp(block.id); }}
              className="p-1 hover:bg-neutral-800 rounded"
              title="Move Up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveDown(block.id); }}
              className="p-1 hover:bg-neutral-800 rounded"
              title="Move Down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
              className="p-1 hover:bg-red-950 text-red-400 rounded"
              title="Delete Block"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {renderContent()}
    </div>
  );
};
