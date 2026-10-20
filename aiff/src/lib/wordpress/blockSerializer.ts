import type { GutenbergBlock } from '../../types/wordpress.ts';

/**
 * Serializes a Gutenberg block tree into native WordPress Gutenberg block comments.
 * Compatible with WordPress 5.0 - 6.7+ Full Site Editing.
 */
export function serializeGutenbergBlock(block: GutenbergBlock): string {
  // Strip transient content from comment attributes to match standard Gutenberg output
  const { content: _content, items: _items, ...commentAttrs } = block.attrs || {};
  const attrsJson = Object.keys(commentAttrs).length > 0 
    ? ` ${JSON.stringify(commentAttrs)}` 
    : '';

  switch (block.blockName) {
    case 'core/heading': {
      const level = block.attrs?.level || 2;
      const content = block.attrs?.content || block.innerHTML || '';
      const textAlign = block.attrs?.textAlign ? ` has-text-align-${block.attrs.textAlign}` : '';
      return `<!-- wp:heading${attrsJson} -->\n<h${level} class="wp-block-heading${textAlign}">${content}</h${level}>\n<!-- /wp:heading -->`;
    }

    case 'core/paragraph': {
      const content = block.attrs?.content || block.innerHTML || '';
      const dropCap = block.attrs?.dropCap ? ' has-drop-cap' : '';
      const textAlign = block.attrs?.align ? ` has-text-align-${block.attrs.align}` : '';
      return `<!-- wp:paragraph${attrsJson} -->\n<p class="${(dropCap + textAlign).trim()}">${content}</p>\n<!-- /wp:paragraph -->`;
    }

    case 'core/cover': {
      const url = block.attrs?.url || '';
      const title = block.attrs?.title || '';
      const dimRatio = block.attrs?.dimRatio ?? 50;
      const innerContent = (block.innerBlocks || []).map(serializeGutenbergBlock).join('\n\n');
      return `<!-- wp:cover${attrsJson} -->\n<div class="wp-block-cover has-custom-content-position is-position-center-center"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-${dimRatio} wp-block-cover__gradient-background"></span><img class="wp-block-cover__image-background" alt="${title}" src="${url}" data-object-fit="cover"/>\n<div class="wp-block-cover__inner-container">\n${innerContent}\n</div></div>\n<!-- /wp:cover -->`;
    }

    case 'core/columns': {
      const innerContent = (block.innerBlocks || []).map(serializeGutenbergBlock).join('\n\n');
      return `<!-- wp:columns${attrsJson} -->\n<div class="wp-block-columns">\n${innerContent}\n</div>\n<!-- /wp:columns -->`;
    }

    case 'core/column': {
      const innerContent = (block.innerBlocks || []).map(serializeGutenbergBlock).join('\n\n');
      return `<!-- wp:column${attrsJson} -->\n<div class="wp-block-column">\n${innerContent}\n</div>\n<!-- /wp:column -->`;
    }

    case 'core/group': {
      const innerContent = (block.innerBlocks || []).map(serializeGutenbergBlock).join('\n\n');
      return `<!-- wp:group${attrsJson} -->\n<div class="wp-block-group">\n${innerContent}\n</div>\n<!-- /wp:group -->`;
    }

    case 'core/buttons': {
      const innerContent = (block.innerBlocks || []).map(serializeGutenbergBlock).join('\n');
      const layout = block.attrs?.layout?.justifyContent ? ` is-content-justification-${block.attrs.layout.justifyContent}` : '';
      return `<!-- wp:buttons${attrsJson} -->\n<div class="wp-block-buttons${layout}">\n${innerContent}\n</div>\n<!-- /wp:buttons -->`;
    }

    case 'core/button': {
      const text = block.attrs?.text || 'Click here';
      const url = block.attrs?.url || '#';
      const className = block.attrs?.className ? ` ${block.attrs.className}` : '';
      return `<!-- wp:button${attrsJson} -->\n<div class="wp-block-button${className}"><a class="wp-block-button__link wp-element-button" href="${url}">${text}</a></div>\n<!-- /wp:button -->`;
    }

    case 'core/image': {
      const url = block.attrs?.url || '';
      const alt = block.attrs?.alt || '';
      const caption = block.attrs?.caption ? `<figcaption class="wp-element-caption">${block.attrs.caption}</figcaption>` : '';
      return `<!-- wp:image${attrsJson} -->\n<figure class="wp-block-image"><img src="${url}" alt="${alt}"/>${caption}</figure>\n<!-- /wp:image -->`;
    }

    case 'core/gallery': {
      const innerContent = (block.innerBlocks || []).map(serializeGutenbergBlock).join('\n');
      const columns = block.attrs?.columns ? ` columns-${block.attrs.columns}` : ' columns-3';
      return `<!-- wp:gallery${attrsJson} -->\n<figure class="wp-block-gallery has-nested-images${columns}">\n${innerContent}\n</figure>\n<!-- /wp:gallery -->`;
    }

    case 'core/quote': {
      const value = block.attrs?.value || block.innerHTML || '';
      const citation = block.attrs?.citation ? `<cite>${block.attrs.citation}</cite>` : '';
      return `<!-- wp:quote${attrsJson} -->\n<blockquote class="wp-block-quote"><p>${value}</p>${citation}</blockquote>\n<!-- /wp:quote -->`;
    }

    case 'core/separator': {
      return `<!-- wp:separator${attrsJson} -->\n<hr class="wp-block-separator has-alpha-channel-opacity"/>\n<!-- /wp:separator -->`;
    }

    case 'core/spacer': {
      const height = block.attrs?.height || '40px';
      return `<!-- wp:spacer${attrsJson} -->\n<div style="height:${height}" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->`;
    }

    case 'core/list': {
      const items = block.attrs?.items || [];
      const lis = items.map((item: string) => `<li>${item}</li>`).join('\n');
      return `<!-- wp:list${attrsJson} -->\n<ul class="wp-block-list">\n${lis}\n</ul>\n<!-- /wp:list -->`;
    }

    default: {
      const inner = (block.innerBlocks || []).map(serializeGutenbergBlock).join('\n');
      return `<!-- wp:${block.blockName.replace('core/', '')}${attrsJson} -->\n${inner || block.innerHTML || ''}\n<!-- /wp:${block.blockName.replace('core/', '')} -->`;
    }
  }
}

/**
 * Serializes an array of Gutenberg blocks into complete page content for WordPress post_content.
 */
export function serializePageBlocks(blocks: GutenbergBlock[]): string {
  if (!blocks || blocks.length === 0) return '';
  return blocks.map(serializeGutenbergBlock).join('\n\n');
}
