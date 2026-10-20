import type { WPSite } from '../../types/wordpress.ts';
import { serializePageBlocks } from './blockSerializer.ts';

/**
 * Generates a complete, functional WordPress PHP plugin file.
 * Automatically bootstraps CPTs, Taxonomies, Menus, Gutenberg Blocks, and Pages upon activation.
 */
export function generatePluginPhp(site: WPSite): string {
  const pluginSlug = site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const className = site.name.replace(/[^a-zA-Z0-9]+/g, '_') + '_Architect';

  const cptRegistrations = (site.customPostTypes || []).map((cpt) => {
    return `
        // Register Custom Post Type: ${cpt.pluralName}
        register_post_type('${cpt.slug}', array(
            'labels' => array(
                'name'               => _x('${cpt.pluralName}', 'post type general name', '${pluginSlug}'),
                'singular_name'      => _x('${cpt.singularName}', 'post type singular name', '${pluginSlug}'),
                'menu_name'          => _x('${cpt.pluralName}', 'admin menu', '${pluginSlug}'),
                'name_admin_bar'     => _x('${cpt.singularName}', 'add new on admin bar', '${pluginSlug}'),
                'add_new'            => _x('Add New', '${cpt.slug}', '${pluginSlug}'),
                'add_new_item'       => __('Add New ${cpt.singularName}', '${pluginSlug}'),
                'new_item'           => __('New ${cpt.singularName}', '${pluginSlug}'),
                'edit_item'          => __('Edit ${cpt.singularName}', '${pluginSlug}'),
                'view_item'          => __('View ${cpt.singularName}', '${pluginSlug}'),
                'all_items'          => __('All ${cpt.pluralName}', '${pluginSlug}'),
                'search_items'       => __('Search ${cpt.pluralName}', '${pluginSlug}'),
                'not_found'          => __('No ${cpt.pluralName.toLowerCase()} found.', '${pluginSlug}'),
                'not_found_in_trash' => __('No ${cpt.pluralName.toLowerCase()} found in Trash.', '${pluginSlug}')
            ),
            'description'         => __('${cpt.description}', '${pluginSlug}'),
            'public'              => true,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'query_var'           => true,
            'rewrite'             => array('slug' => '${cpt.slug}'),
            'capability_type'     => 'post',
            'has_archive'         => true,
            'hierarchical'        => false,
            'menu_position'       => 20,
            'menu_icon'           => '${cpt.icon || 'dashicons-portfolio'}',
            'supports'            => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'show_in_rest'        => true
        ));`;
  }).join('\n');

  const taxonomyRegistrations = (site.taxonomies || []).map((tax) => {
    const postTypesPhp = JSON.stringify(tax.associatedPostTypes).replace(/"/g, "'");
    return `
        // Register Taxonomy: ${tax.pluralName}
        register_taxonomy('${tax.slug}', ${postTypesPhp}, array(
            'hierarchical'      => ${tax.hierarchical ? 'true' : 'false'},
            'labels'            => array(
                'name'              => _x('${tax.pluralName}', 'taxonomy general name', '${pluginSlug}'),
                'singular_name'     => _x('${tax.singularName}', 'taxonomy singular name', '${pluginSlug}'),
                'search_items'      => __('Search ${tax.pluralName}', '${pluginSlug}'),
                'all_items'         => __('All ${tax.pluralName}', '${pluginSlug}'),
                'parent_item'       => __('Parent ${tax.singularName}', '${pluginSlug}'),
                'parent_item_colon' => __('Parent ${tax.singularName}:', '${pluginSlug}'),
                'edit_item'         => __('Edit ${tax.singularName}', '${pluginSlug}'),
                'update_item'       => __('Update ${tax.singularName}', '${pluginSlug}'),
                'add_new_item'      => __('Add New ${tax.singularName}', '${pluginSlug}'),
                'new_item_name'     => __('New ${tax.singularName} Name', '${pluginSlug}'),
                'menu_name'         => __('${tax.pluralName}', '${pluginSlug}'),
            ),
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => '${tax.slug}'),
            'show_in_rest'      => true,
        ));`;
  }).join('\n');

  const pageCreationPhp = site.pages.map((p) => {
    const rawContent = serializePageBlocks(p.blocks);
    // Escape single quotes and backslashes for PHP string literal
    const escapedContent = rawContent.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `
            // Page: ${p.title}
            if (!get_page_by_path('${p.slug}')) {
                $page_id = wp_insert_post(array(
                    'post_title'     => '${p.title.replace(/'/g, "\\'")}',
                    'post_name'      => '${p.slug}',
                    'post_content'   => '${escapedContent}',
                    'post_status'    => 'publish',
                    'post_type'      => 'page',
                    'menu_order'     => ${p.order},
                    'comment_status' => 'closed',
                    'ping_status'    => 'closed'
                ));

                if ($page_id && !is_wp_error($page_id)) {
                    update_post_meta($page_id, '_wp_page_template', '${p.template}');
                    update_post_meta($page_id, '_yoast_wpseo_title', '${p.seo?.metaTitle?.replace(/'/g, "\\'") || p.title}');
                    update_post_meta($page_id, '_yoast_wpseo_metadesc', '${p.seo?.metaDescription?.replace(/'/g, "\\'") || ''}');
                    ${p.isFrontPage ? `
                    update_option('show_on_front', 'page');
                    update_option('page_on_front', $page_id);
                    ` : ''}
                }
            }`;
  }).join('\n');

  return `<?php
/**
 * Plugin Name: AI Site Architect - ${site.name}
 * Plugin URI: https://wordpress.org/plugins/ai-site-architect/
 * Description: Automatically provisioned architecture for "${site.name}". Configures CPTs, navigation menus, Gutenberg block templates, and theme design tokens.
 * Version: 1.0.0
 * Author: AI Site Architect Engine
 * Author URI: https://aisitearchitect.dev
 * License: GPL v2 or later
 * Text Domain: ${pluginSlug}
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class ${className} {

    public function __construct() {
        add_action('init', array($this, 'register_structures'));
        add_action('after_setup_theme', array($this, 'setup_theme_features'));
        register_activation_hook(__FILE__, array($this, 'activate_plugin'));
    }

    /**
     * Register Custom Post Types and Taxonomies
     */
    public function register_structures() {
${cptRegistrations}
${taxonomyRegistrations}

        // Register Navigation Menus
        register_nav_menus(array(
            'primary' => __('Primary Navigation Menu', '${pluginSlug}'),
            'footer'  => __('Footer Navigation Menu', '${pluginSlug}'),
            'mobile'  => __('Mobile Navigation Menu', '${pluginSlug}')
        ));
    }

    /**
     * Setup Theme features: Block styles, color palettes, align-wide
     */
    public function setup_theme_features() {
        add_theme_support('align-wide');
        add_theme_support('responsive-embeds');
        add_theme_support('editor-styles');
        add_theme_support('wp-block-styles');

        // Register custom color palette
        add_theme_support('editor-color-palette', array(
            array(
                'name'  => esc_attr__('Primary', '${pluginSlug}'),
                'slug'  => 'primary',
                'color' => '${site.theme?.palette?.primary || '#111827'}',
            ),
            array(
                'name'  => esc_attr__('Secondary', '${pluginSlug}'),
                'slug'  => 'secondary',
                'color' => '${site.theme?.palette?.secondary || '#6366f1'}',
            ),
            array(
                'name'  => esc_attr__('Accent', '${pluginSlug}'),
                'slug'  => 'accent',
                'color' => '${site.theme?.palette?.accent || '#f43f5e'}',
            ),
            array(
                'name'  => esc_attr__('Background', '${pluginSlug}'),
                'slug'  => 'background',
                'color' => '${site.theme?.palette?.background || '#ffffff'}',
            ),
        ));
    }

    /**
     * Activation Hook: Automatically generates pages with Gutenberg blocks
     */
    public function activate_plugin() {
        // Run structure registration first
        $this->register_structures();

        // Populate initial pages if not already created
${pageCreationPhp}

        flush_rewrite_rules();
    }
}

// Initialize the plugin
new ${className}();
`;
}
