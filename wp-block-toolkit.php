<?php
declare(strict_types=1);
/**
 * Plugin Name:  WP Block Toolkit
 * Description:  Production Gutenberg blocks — dynamic data table, composable card grid, and conditional content.
 * Version:      1.0.0
 * Requires PHP: 8.0
 * License:      GPL-2.0-or-later
 *
 * @package BlockToolkit
 */

defined( 'ABSPATH' ) || exit;

define( 'BLOCK_TOOLKIT_DIR', plugin_dir_path( __FILE__ ) );
define( 'BLOCK_TOOLKIT_URL', plugin_dir_url( __FILE__ ) );
define( 'BLOCK_TOOLKIT_VERSION', '1.0.0' );

add_action( 'init', static function (): void {
	require_once BLOCK_TOOLKIT_DIR . 'src/Blocks/DataTable/register.php';
	require_once BLOCK_TOOLKIT_DIR . 'src/Blocks/CardGrid/register.php';
	require_once BLOCK_TOOLKIT_DIR . 'src/Blocks/Card/register.php';
	require_once BLOCK_TOOLKIT_DIR . 'src/Blocks/Conditional/register.php';
} );
