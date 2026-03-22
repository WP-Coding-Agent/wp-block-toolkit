import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	DateTimePicker,
} from '@wordpress/components';

import metadata from '../../src/Blocks/Conditional/block.json';

const CONDITION_LABELS = {
	logged_in: __('Logged-in users', 'block-toolkit'),
	logged_out: __('Logged-out visitors', 'block-toolkit'),
	role: __('Specific user role', 'block-toolkit'),
	date_range: __('Date range', 'block-toolkit'),
	custom: __('Custom PHP filter', 'block-toolkit'),
};

function ConditionalEdit({ attributes, setAttributes }) {
	const { conditionType, role, dateStart, dateEnd, customFilter } = attributes;

	const blockProps = useBlockProps({
		className: 'dev-conditional-editor',
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'dev-conditional-editor__content' },
		{ template: [['core/paragraph', { placeholder: __('Add conditional content...', 'block-toolkit') }]] }
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Visibility Condition', 'block-toolkit')}>
					<SelectControl
						label={__('Show content when', 'block-toolkit')}
						value={conditionType}
						options={Object.entries(CONDITION_LABELS).map(([value, label]) => ({ value, label }))}
						onChange={(val) => setAttributes({ conditionType: val })}
					/>

					{conditionType === 'role' && (
						<TextControl
							label={__('User Role(s)', 'block-toolkit')}
							help={__('Comma-separated: administrator, editor', 'block-toolkit')}
							value={role}
							onChange={(val) => setAttributes({ role: val })}
						/>
					)}

					{conditionType === 'date_range' && (
						<>
							<p>{__('Start Date', 'block-toolkit')}</p>
							<DateTimePicker
								currentDate={dateStart || undefined}
								onChange={(val) => setAttributes({ dateStart: val })}
								is12Hour={false}
							/>
							<p style={{ marginTop: '16px' }}>{__('End Date', 'block-toolkit')}</p>
							<DateTimePicker
								currentDate={dateEnd || undefined}
								onChange={(val) => setAttributes({ dateEnd: val })}
								is12Hour={false}
							/>
						</>
					)}

					{conditionType === 'custom' && (
						<TextControl
							label={__('Filter Name', 'block-toolkit')}
							help={__('A PHP filter that returns true/false. Example: my_promo_active', 'block-toolkit')}
							value={customFilter}
							onChange={(val) => setAttributes({ customFilter: val })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="dev-conditional-editor__badge">
					{CONDITION_LABELS[conditionType] || conditionType}
					{conditionType === 'role' && role && `: ${role}`}
				</div>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}

registerBlockType(metadata.name, {
	edit: ConditionalEdit,
	save: ({ children }) => <div className="wp-block-developer-conditional"><InnerBlocksContent /></div>,
});

import { InnerBlocks } from '@wordpress/block-editor';
const InnerBlocksContent = () => <InnerBlocks.Content />;
