import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import metadata from './block.json';

const ALLOWED_BLOCKS = ['developer/card'];
const TEMPLATE = [
	['developer/card', {}],
	['developer/card', {}],
	['developer/card', {}],
];

function CardGridEdit({ attributes, setAttributes }) {
	const { columns, gap, minCardWidth } = attributes;

	const blockProps = useBlockProps({
		className: 'dev-card-grid',
		style: {
			'--grid-columns': columns,
			'--grid-gap': gap,
			'--grid-min-card': minCardWidth,
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		orientation: 'horizontal',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Grid Layout', 'block-toolkit')}>
					<RangeControl
						label={__('Max Columns', 'block-toolkit')}
						value={columns}
						onChange={(val) => setAttributes({ columns: val })}
						min={1}
						max={6}
					/>
					<UnitControl
						label={__('Gap', 'block-toolkit')}
						value={gap}
						onChange={(val) => setAttributes({ gap: val })}
						units={[
							{ value: 'rem', label: 'rem' },
							{ value: 'px', label: 'px' },
							{ value: 'em', label: 'em' },
						]}
					/>
					<UnitControl
						label={__('Min Card Width', 'block-toolkit')}
						value={minCardWidth}
						onChange={(val) => setAttributes({ minCardWidth: val })}
						units={[
							{ value: 'px', label: 'px' },
							{ value: 'rem', label: 'rem' },
						]}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
}

function CardGridSave({ attributes }) {
	const { columns, gap, minCardWidth } = attributes;
	const blockProps = useBlockProps.save({
		className: 'dev-card-grid',
		style: {
			'--grid-columns': columns,
			'--grid-gap': gap,
			'--grid-min-card': minCardWidth,
		},
	});

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
}

registerBlockType(metadata.name, {
	edit: CardGridEdit,
	save: CardGridSave,
});
