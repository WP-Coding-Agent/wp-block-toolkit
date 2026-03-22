import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	Button,
	TextControl,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { useState } from '@wordpress/element';

import metadata from './block.json';

function DataTableEdit({ attributes, setAttributes }) {
	const { postType, perPage, orderBy, order, columns, metaColumns, filters } = attributes;
	const blockProps = useBlockProps();

	const addColumn = () => {
		setAttributes({ columns: [...columns, { key: '', label: '' }] });
	};

	const updateColumn = (index, field, value) => {
		const updated = columns.map((col, i) =>
			i === index ? { ...col, [field]: value } : col
		);
		setAttributes({ columns: updated });
	};

	const removeColumn = (index) => {
		setAttributes({ columns: columns.filter((_, i) => i !== index) });
	};

	const addMetaColumn = () => {
		setAttributes({ metaColumns: [...metaColumns, { key: '', label: '' }] });
	};

	const updateMetaColumn = (index, field, value) => {
		const updated = metaColumns.map((col, i) =>
			i === index ? { ...col, [field]: value } : col
		);
		setAttributes({ metaColumns: updated });
	};

	const removeMetaColumn = (index) => {
		setAttributes({ metaColumns: metaColumns.filter((_, i) => i !== index) });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Query Settings', 'block-toolkit')}>
					<SelectControl
						label={__('Post Type', 'block-toolkit')}
						value={postType}
						options={[
							{ label: 'Posts', value: 'post' },
							{ label: 'Pages', value: 'page' },
							{ label: 'Products', value: 'product' },
							{ label: 'Portfolio', value: 'portfolio' },
						]}
						onChange={(val) => setAttributes({ postType: val })}
					/>
					<RangeControl
						label={__('Results Per Page', 'block-toolkit')}
						value={perPage}
						onChange={(val) => setAttributes({ perPage: val })}
						min={1}
						max={100}
					/>
					<SelectControl
						label={__('Order By', 'block-toolkit')}
						value={orderBy}
						options={[
							{ label: 'Date', value: 'date' },
							{ label: 'Title', value: 'title' },
							{ label: 'Modified', value: 'modified' },
							{ label: 'Menu Order', value: 'menu_order' },
						]}
						onChange={(val) => setAttributes({ orderBy: val })}
					/>
					<SelectControl
						label={__('Order', 'block-toolkit')}
						value={order}
						options={[
							{ label: 'Descending', value: 'desc' },
							{ label: 'Ascending', value: 'asc' },
						]}
						onChange={(val) => setAttributes({ order: val })}
					/>
				</PanelBody>

				<PanelBody title={__('Standard Columns', 'block-toolkit')} initialOpen={false}>
					{columns.map((col, i) => (
						<div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
							<SelectControl
								label={i === 0 ? __('Field', 'block-toolkit') : ''}
								value={col.key}
								options={[
									{ label: '—', value: '' },
									{ label: 'Title', value: 'title' },
									{ label: 'Date', value: 'date' },
									{ label: 'Author', value: 'author' },
									{ label: 'Excerpt', value: 'excerpt' },
									{ label: 'Status', value: 'status' },
									{ label: 'ID', value: 'id' },
								]}
								onChange={(val) => updateColumn(i, 'key', val)}
							/>
							<TextControl
								label={i === 0 ? __('Label', 'block-toolkit') : ''}
								value={col.label}
								onChange={(val) => updateColumn(i, 'label', val)}
							/>
							<Button isDestructive isSmall onClick={() => removeColumn(i)} icon="no-alt" />
						</div>
					))}
					<Button variant="secondary" isSmall onClick={addColumn}>
						{__('Add Column', 'block-toolkit')}
					</Button>
				</PanelBody>

				<PanelBody title={__('Meta Columns', 'block-toolkit')} initialOpen={false}>
					{metaColumns.map((col, i) => (
						<div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
							<TextControl
								label={i === 0 ? __('Meta Key', 'block-toolkit') : ''}
								value={col.key}
								onChange={(val) => updateMetaColumn(i, 'key', val)}
								placeholder="_price"
							/>
							<TextControl
								label={i === 0 ? __('Label', 'block-toolkit') : ''}
								value={col.label}
								onChange={(val) => updateMetaColumn(i, 'label', val)}
							/>
							<Button isDestructive isSmall onClick={() => removeMetaColumn(i)} icon="no-alt" />
						</div>
					))}
					<Button variant="secondary" isSmall onClick={addMetaColumn}>
						{__('Add Meta Column', 'block-toolkit')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ServerSideRender block="developer/data-table" attributes={attributes} />
			</div>
		</>
	);
}

registerBlockType(metadata.name, {
	edit: DataTableEdit,
	save: () => null, // Dynamic block — rendered server-side.
});
