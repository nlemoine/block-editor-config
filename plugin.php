<?php

/**
 * Plugin Name:       Block Editor Config
 * Plugin URI:        https://github.com/nlemoine/block-editor-config
 * Description:       Block editor configurator
 * Version:           0.1.0
 * Requires at least: 5.5
 * Requires PHP:      7.4
 * Author:            Nicolas Lemoine
 * Author URI:        https://github.com/nlemoine
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Domain Path:       /languages
 */

namespace n5s\BlockEditorConfig;

/**
 * Get versioned asset name
 *
 * @param string $asset
 * @return string|null
 */
function get_asset(string $asset): ?string
{
    $plugin_path = \untrailingslashit(\plugin_dir_path(__FILE__));
    $manifest_path = $plugin_path . '/assets/dist/manifest.json';
    if (\is_file($manifest_path) && \is_readable($manifest_path)) {
        $manifest = \json_decode(\file_get_contents($manifest_path), true);
        return $manifest[$asset] ?? null;
    }
    return null;
}

/**
 * Get asset url
 *
 * @param string $asset
 * @return string|null
 */
function get_asset_url(string $asset): ?string
{
    $plugin_url = \untrailingslashit(\plugin_dir_url(__FILE__));
    $asset_versioned = get_asset($asset);
    return $asset_versioned ? \sprintf('%s/assets/dist/%s', $plugin_url, $asset_versioned) : null;
}

/**
 * Get asset path
 *
 * @param string $asset
 * @return string
 */
function get_asset_path(string $asset): ?string
{
    $plugin_path = \untrailingslashit(\plugin_dir_path(__FILE__));
    $asset_versioned = get_asset($asset);
    return $asset_versioned ? \sprintf('%s/assets/dist/%s', $plugin_path, $asset_versioned) : null;
}

/**
 * Add block editor config script
 *
 * @return void
 */
function add_block_config_script(): void
{
	$config = get_config();
	if(empty($config)) {
		return;
	}

    $asset_path = get_asset_path('block-editor-config.php');
    $asset_url = get_asset_url('block-editor-config.js');
    if (!$asset_path || !$asset_url) {
        return;
    }

    if (!\is_file($asset_path)) {
        return;
    }

    $asset_args = require $asset_path;
	$dependencies = $asset_args['dependencies'] ?? [];
	if(!empty($dependencies)) {
		array_push($dependencies, 'wp-edit-post');
	}

    \wp_enqueue_script(
        'block-editor-config',
        $asset_url,
        $dependencies,
        null
    );
	wp_add_inline_script( 'block-editor-config', 'var blockEditorConfig = ' . json_encode($config), 'before' );
}
\add_action('enqueue_block_editor_assets', __NAMESPACE__ . '\\add_block_config_script');


/**
 * Get Editor Config
 *
 * @return array
 */
function get_config(): array {
	$config = apply_filters('bec/config', []);

	if(empty($config['blocks'])) {
		return [];
	}

	foreach($config['blocks'] as $k => $block) {
		if(is_numeric($k)) {
			$config['blocks'][] = [
				'name' => $block,
			];
		} elseif(is_array($block)) {
			$config['blocks'][] = array_merge([
				'name' => $k,
			], $block);
		}
		unset($config['blocks'][$k]);
	}

	$config['blocks'] = array_values($config['blocks']);
	return $config;
}
