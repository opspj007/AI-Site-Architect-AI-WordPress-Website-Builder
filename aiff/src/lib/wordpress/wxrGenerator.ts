import type { WPSite } from '../../types/wordpress.ts';
import { serializePageBlocks } from './blockSerializer.ts';

/**
 * Escapes CDATA content to prevent breaking XML tags
 */
function escapeCdata(str: string): string {
  return (str || '').replace(/]]>/g, ']]]]><![CDATA[>');
}

/**
 * Generates an official WordPress eXtended RSS (WXR 1.2) XML export file.
 * Compatible with Tools -> Import -> WordPress on any standard WordPress installation.
 */
export function generateWXRXml(site: WPSite): string {
  const pubDate = new Date().toUTCString();
  const domain = 'https://example.com';
  let postIdCounter = 100;

  // Track page IDs for menu linking
  const pageIdMap: Record<string, number> = {};
  site.pages.forEach((p) => {
    postIdCounter += 1;
    pageIdMap[p.slug] = postIdCounter;
  });

  const pageItems = site.pages.map((page) => {
    const postId = pageIdMap[page.slug];
    const postContent = serializePageBlocks(page.blocks);
    const postDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return `
    <item>
      <title><![CDATA[${escapeCdata(page.title)}]]></title>
      <link>${domain}/${page.slug}/</link>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[admin]]></dc:creator>
      <guid isPermaLink="false">${domain}/?page_id=${postId}</guid>
      <description></description>
      <content:encoded><![CDATA[${escapeCdata(postContent)}]]></content:encoded>
      <excerpt:encoded><![CDATA[${escapeCdata(page.seo.metaDescription || '')}]]></excerpt:encoded>
      <wp:post_id>${postId}</wp:post_id>
      <wp:post_date><![CDATA[${postDate}]]></wp:post_date>
      <wp:post_date_gmt><![CDATA[${postDate}]]></wp:post_date_gmt>
      <wp:post_modified><![CDATA[${postDate}]]></wp:post_modified>
      <wp:post_modified_gmt><![CDATA[${postDate}]]></wp:post_modified_gmt>
      <wp:comment_status><![CDATA[closed]]></wp:comment_status>
      <wp:ping_status><![CDATA[closed]]></wp:ping_status>
      <wp:post_name><![CDATA[${page.slug}]]></wp:post_name>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>${page.order}</wp:menu_order>
      <wp:post_type><![CDATA[page]]></wp:post_type>
      <wp:post_password><![CDATA[]]></wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_wp_page_template]]></wp:meta_key>
        <wp:meta_value><![CDATA[${page.template || 'default'}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_yoast_wpseo_title]]></wp:meta_key>
        <wp:meta_value><![CDATA[${escapeCdata(page.seo.metaTitle || page.title)}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_yoast_wpseo_metadesc]]></wp:meta_key>
        <wp:meta_value><![CDATA[${escapeCdata(page.seo.metaDescription || '')}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_yoast_wpseo_focuskw]]></wp:meta_key>
        <wp:meta_value><![CDATA[${escapeCdata(page.seo.focusKeywords?.[0] || '')}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_rank_math_title]]></wp:meta_key>
        <wp:meta_value><![CDATA[${escapeCdata(page.seo.metaTitle || page.title)}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_rank_math_description]]></wp:meta_key>
        <wp:meta_value><![CDATA[${escapeCdata(page.seo.metaDescription || '')}]]></wp:meta_value>
      </wp:postmeta>
      ${page.isFrontPage ? `
      <wp:postmeta>
        <wp:meta_key><![CDATA[_ai_is_front_page]]></wp:meta_key>
        <wp:meta_value><![CDATA[1]]></wp:meta_value>
      </wp:postmeta>` : ''}
    </item>`;
  }).join('\n');

  // Custom Post Types items
  const cptItems = (site.customPostTypes || []).flatMap((cpt) => {
    return (cpt.sampleItems || []).map((item) => {
      postIdCounter += 1;
      const itemId = postIdCounter;
      const postDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

      const customMeta = Object.entries(item.customFields || {}).map(([k, v]) => `
      <wp:postmeta>
        <wp:meta_key><![CDATA[${k}]]></wp:meta_key>
        <wp:meta_value><![CDATA[${escapeCdata(String(v))}]]></wp:meta_value>
      </wp:postmeta>`).join('\n');

      return `
    <item>
      <title><![CDATA[${escapeCdata(item.title)}]]></title>
      <link>${domain}/${cpt.slug}/${item.slug}/</link>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[admin]]></dc:creator>
      <guid isPermaLink="false">${domain}/?post_type=${cpt.slug}&#038;p=${itemId}</guid>
      <description></description>
      <content:encoded><![CDATA[${escapeCdata(item.content || item.excerpt || '')}]]></content:encoded>
      <excerpt:encoded><![CDATA[${escapeCdata(item.excerpt || '')}]]></excerpt:encoded>
      <wp:post_id>${itemId}</wp:post_id>
      <wp:post_date><![CDATA[${postDate}]]></wp:post_date>
      <wp:post_date_gmt><![CDATA[${postDate}]]></wp:post_date_gmt>
      <wp:post_modified><![CDATA[${postDate}]]></wp:post_modified>
      <wp:post_modified_gmt><![CDATA[${postDate}]]></wp:post_modified_gmt>
      <wp:comment_status><![CDATA[closed]]></wp:comment_status>
      <wp:ping_status><![CDATA[closed]]></wp:ping_status>
      <wp:post_name><![CDATA[${item.slug}]]></wp:post_name>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type><![CDATA[${cpt.slug}]]></wp:post_type>
      <wp:post_password><![CDATA[]]></wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
      ${customMeta}
    </item>`;
    });
  }).join('\n');

  // Navigation menu items
  const menuItems = (site.menus || []).flatMap((menu) => {
    return (menu.items || []).map((item, index) => {
      postIdCounter += 1;
      const itemId = postIdCounter;
      const targetPageId = item.targetPageSlug ? pageIdMap[item.targetPageSlug] || 0 : 0;
      const targetUrl = item.targetPageSlug ? `${domain}/${item.targetPageSlug}/` : item.url;

      return `
    <item>
      <title><![CDATA[${escapeCdata(item.title)}]]></title>
      <link>${domain}/?p=${itemId}</link>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[admin]]></dc:creator>
      <guid isPermaLink="false">${domain}/?p=${itemId}</guid>
      <description></description>
      <content:encoded><![CDATA[]]></content:encoded>
      <excerpt:encoded><![CDATA[]]></excerpt:encoded>
      <wp:post_id>${itemId}</wp:post_id>
      <wp:post_date><![CDATA[${new Date().toISOString().replace('T', ' ').substring(0, 19)}]]></wp:post_date>
      <wp:comment_status><![CDATA[closed]]></wp:comment_status>
      <wp:ping_status><![CDATA[closed]]></wp:ping_status>
      <wp:post_name><![CDATA[menu-item-${itemId}]]></wp:post_name>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>${index + 1}</wp:menu_order>
      <wp:post_type><![CDATA[nav_menu_item]]></wp:post_type>
      <wp:category domain="nav_menu" nicename="${menu.location}"><![CDATA[${menu.name}]]></wp:category>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_menu_item_type]]></wp:meta_key>
        <wp:meta_value><![CDATA[${targetPageId ? 'post_type' : 'custom'}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_menu_item_object]]></wp:meta_key>
        <wp:meta_value><![CDATA[${targetPageId ? 'page' : 'custom'}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_menu_item_object_id]]></wp:meta_key>
        <wp:meta_value><![CDATA[${targetPageId}]]></wp:meta_value>
      </wp:postmeta>
      <wp:postmeta>
        <wp:meta_key><![CDATA[_menu_item_url]]></wp:meta_key>
        <wp:meta_value><![CDATA[${targetUrl}]]></wp:meta_value>
      </wp:postmeta>
    </item>`;
    });
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<!-- generator="WordPress/6.7 (AI Site Architect)" created="${new Date().toISOString()}" -->
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">

  <channel>
    <title><![CDATA[${escapeCdata(site.name)}]]></title>
    <link>${domain}</link>
    <description><![CDATA[${escapeCdata(site.tagline)}]]></description>
    <pubDate>${pubDate}</pubDate>
    <language>en-US</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>${domain}</wp:base_site_url>
    <wp:base_blog_url>${domain}</wp:base_blog_url>

    <wp:author>
      <wp:author_id>1</wp:author_id>
      <wp:author_login><![CDATA[admin]]></wp:author_login>
      <wp:author_email><![CDATA[admin@example.com]]></wp:author_email>
      <wp:author_display_name><![CDATA[Site Administrator]]></wp:author_display_name>
      <wp:author_first_name><![CDATA[Site]]></wp:author_first_name>
      <wp:author_last_name><![CDATA[Admin]]></wp:author_last_name>
    </wp:author>

    ${(site.taxonomies || []).map((tax) => (tax.terms || []).map((term) => `
    <wp:term>
      <wp:term_id>${++postIdCounter}</wp:term_id>
      <wp:term_taxonomy><![CDATA[${tax.slug}]]></wp:term_taxonomy>
      <wp:term_slug><![CDATA[${term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}]]></wp:term_slug>
      <wp:term_parent><![CDATA[]]></wp:term_parent>
      <wp:term_name><![CDATA[${escapeCdata(term)}]]></wp:term_name>
    </wp:term>`).join('\n')).join('\n')}

${pageItems}
${cptItems}
${menuItems}

  </channel>
</rss>`;
}
