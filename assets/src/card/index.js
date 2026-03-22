import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	URLInput,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	Button,
	TextControl,
} from '@wordpress/components';

import metadata from './block.json';

function CardEdit({ attributes, setAttributes }) {
	const { imageUrl, imageId, heading, description, linkUrl, linkText, badge } = attributes;
	const blockProps = useBlockProps({ className: 'dev-card' });

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Card Settings', 'block-toolkit')}>
					<TextControl
						label={__('Badge', 'block-toolkit')}
						value={badge}
						onChange={(val) => setAttributes({ badge: val })}
						placeholder={__('e.g. Featured, New', 'block-toolkit')}
					/>
					<PanelRow>
						<div style={{ width: '100%' }}>
							<p>{__('Link URL', 'block-toolkit')}</p>
							<URLInput
								value={linkUrl}
								onChange={(url) => setAttributes({ linkUrl: url })}
							/>
						</div>
					</PanelRow>
					<TextControl
						label={__('Link Text', 'block-toolkit')}
						value={linkText}
						onChange={(val) => setAttributes({ linkText: val })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(media) => setAttributes({ imageId: media.id, imageUrl: media.url })}
						allowedTypes={['image']}
						value={imageId}
						render={({ open }) => (
							<div className="dev-card__image" onClick={open} role="button" tabIndex={0}>
								{imageUrl ? (
									<img src={imageUrl} alt="" />
								) : (
									<div className="dev-card__image-placeholder">
										{__('Click to select image', 'block-toolkit')}
									</div>
								)}
							</div>
						)}
					/>
				</MediaUploadCheck>

				{badge && <span className="dev-card__badge">{badge}</span>}

				<div className="dev-card__content">
					<RichText
						tagName="h3"
						className="dev-card__heading"
						value={heading}
						onChange={(val) => setAttributes({ heading: val })}
						placeholder={__('Card Title', 'block-toolkit')}
					/>
					<RichText
						tagName="p"
						className="dev-card__description"
						value={description}
						onChange={(val) => setAttributes({ description: val })}
						placeholder={__('Card description...', 'block-toolkit')}
					/>
				</div>
			</div>
		</>
	);
}

function CardSave({ attributes }) {
	const { imageUrl, heading, description, linkUrl, linkText, badge } = attributes;
	const blockProps = useBlockProps.save({ className: 'dev-card' });

	return (
		<div {...blockProps}>
			{imageUrl && (
				<div className="dev-card__image">
					<img src={imageUrl} alt="" loading="lazy" />
				</div>
			)}
			{badge && <span className="dev-card__badge">{badge}</span>}
			<div className="dev-card__content">
				<RichText.Content tagName="h3" className="dev-card__heading" value={heading} />
				<RichText.Content tagName="p" className="dev-card__description" value={description} />
				{linkUrl && (
					<a className="dev-card__link" href={linkUrl} rel="noopener noreferrer">
						{linkText || __('Learn more', 'block-toolkit')}
					</a>
				)}
			</div>
		</div>
	);
}

registerBlockType(metadata.name, {
	edit: CardEdit,
	save: CardSave,
});
