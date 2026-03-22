<?php
declare(strict_types=1);

namespace BlockToolkit\Blocks\DataTable;

defined( 'ABSPATH' ) || exit;

register_block_type(
	BLOCK_TOOLKIT_DIR . 'build/data-table',
	[
		'render_callback' => __NAMESPACE__ . '\\render',
	]
);

/**
 * Server-side render for the Data Table block.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Inner content (unused for dynamic blocks).
 * @return string HTML output.
 */
function render( array $attributes, string $content ): string {
	$post_type    = sanitize_key( $attributes['postType'] ?? 'post' );
	$per_page     = min( absint( $attributes['perPage'] ?? 10 ), 100 );
	$order_by     = sanitize_key( $attributes['orderBy'] ?? 'date' );
	$order        = in_array( strtoupper( $attributes['order'] ?? 'DESC' ), [ 'ASC', 'DESC' ], true )
		? strtoupper( $attributes['order'] )
		: 'DESC';
	$columns      = $attributes['columns'] ?? [];
	$meta_columns = $attributes['metaColumns'] ?? [];
	$filters      = $attributes['filters'] ?? [];

	$query_args = [
		'post_type'      => $post_type,
		'posts_per_page' => $per_page,
		'orderby'        => $order_by,
		'order'          => $order,
		'post_status'    => 'publish',
	];

	// Apply taxonomy/meta filters.
	foreach ( $filters as $filter ) {
		if ( ! empty( $filter['taxonomy'] ) && ! empty( $filter['term'] ) ) {
			$query_args['tax_query']   = $query_args['tax_query'] ?? [];
			$query_args['tax_query'][] = [
				'taxonomy' => sanitize_key( $filter['taxonomy'] ),
				'field'    => 'slug',
				'terms'    => sanitize_text_field( $filter['term'] ),
			];
		} elseif ( ! empty( $filter['metaKey'] ) && isset( $filter['metaValue'] ) ) {
			$query_args['meta_query']   = $query_args['meta_query'] ?? []; // phpcs:ignore WordPress.DB.SlowDBQuery
			$query_args['meta_query'][] = [
				'key'     => sanitize_key( $filter['metaKey'] ),
				'value'   => sanitize_text_field( $filter['metaValue'] ),
				'compare' => sanitize_text_field( $filter['compare'] ?? '=' ),
			];
		}
	}

	$query = new \WP_Query( $query_args );

	if ( ! $query->have_posts() ) {
		return '<p>' . esc_html__( 'No results found.', 'block-toolkit' ) . '</p>';
	}

	$all_columns = array_merge( $columns, $meta_columns );

	ob_start();
	?>
	<div class="wp-block-developer-data-table" role="region" aria-label="<?php esc_attr_e( 'Data table', 'block-toolkit' ); ?>">
		<table role="table">
			<thead>
				<tr>
					<?php foreach ( $all_columns as $col ) : ?>
						<th scope="col"><?php echo esc_html( $col['label'] ?? $col['key'] ); ?></th>
					<?php endforeach; ?>
				</tr>
			</thead>
			<tbody>
				<?php while ( $query->have_posts() ) : $query->the_post(); ?>
					<tr>
						<?php foreach ( $columns as $col ) : ?>
							<td><?php echo esc_html( get_column_value( $col['key'], get_the_ID() ) ); ?></td>
						<?php endforeach; ?>
						<?php foreach ( $meta_columns as $col ) : ?>
							<td><?php echo esc_html( (string) get_post_meta( get_the_ID(), $col['key'], true ) ); ?></td>
						<?php endforeach; ?>
					</tr>
				<?php endwhile; ?>
			</tbody>
		</table>
	</div>
	<?php
	wp_reset_postdata();
	return (string) ob_get_clean();
}

/**
 * Get a standard column value from a post.
 */
function get_column_value( string $key, int $post_id ): string {
	return match ( $key ) {
		'title'   => get_the_title( $post_id ),
		'date'    => get_the_date( '', $post_id ),
		'author'  => (string) get_the_author(),
		'excerpt' => get_the_excerpt( $post_id ),
		'status'  => (string) get_post_status( $post_id ),
		'type'    => (string) get_post_type( $post_id ),
		'id'      => (string) $post_id,
		default   => (string) get_post_meta( $post_id, $key, true ),
	};
}
