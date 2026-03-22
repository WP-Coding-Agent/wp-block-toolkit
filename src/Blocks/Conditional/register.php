<?php
declare(strict_types=1);

namespace BlockToolkit\Blocks\Conditional;

defined( 'ABSPATH' ) || exit;

register_block_type(
	BLOCK_TOOLKIT_DIR . 'build/conditional',
	[
		'render_callback' => __NAMESPACE__ . '\\render',
	]
);

/**
 * Server-side render — evaluates the condition and either renders
 * inner content or returns empty string.
 *
 * Visibility logic MUST run in PHP (not JS) to prevent content leaking
 * in the page source.
 */
function render( array $attributes, string $content ): string {
	$type = $attributes['conditionType'] ?? 'logged_in';

	$visible = match ( $type ) {
		'logged_in'  => is_user_logged_in(),
		'logged_out' => ! is_user_logged_in(),
		'role'       => check_role( $attributes['role'] ?? '' ),
		'date_range' => check_date_range( $attributes['dateStart'] ?? '', $attributes['dateEnd'] ?? '' ),
		'custom'     => check_custom( $attributes['customFilter'] ?? '' ),
		default      => false,
	};

	/**
	 * Override the visibility check for any conditional block.
	 *
	 * @param bool   $visible    Whether the block should be visible.
	 * @param array  $attributes Block attributes.
	 * @return bool
	 */
	$visible = (bool) apply_filters( 'developer_conditional_check', $visible, $attributes );

	if ( ! $visible ) {
		return '';
	}

	return sprintf(
		'<div class="wp-block-developer-conditional">%s</div>',
		$content // InnerBlocks content — already escaped by WordPress block rendering.
	);
}

function check_role( string $role ): bool {
	if ( empty( $role ) || ! is_user_logged_in() ) {
		return false;
	}

	$user  = wp_get_current_user();
	$roles = array_map( 'trim', explode( ',', $role ) );

	return ! empty( array_intersect( $roles, $user->roles ) );
}

function check_date_range( string $start, string $end ): bool {
	$now = current_time( 'timestamp' );

	if ( $start && strtotime( $start ) > $now ) {
		return false;
	}

	if ( $end && strtotime( $end ) < $now ) {
		return false;
	}

	return true;
}

function check_custom( string $filter_name ): bool {
	if ( empty( $filter_name ) ) {
		return false;
	}

	// Only allow alphanumeric + underscore filter names to prevent injection.
	if ( ! preg_match( '/^[a-zA-Z_][a-zA-Z0-9_]*$/', $filter_name ) ) {
		return false;
	}

	return (bool) apply_filters( $filter_name, false );
}
