import domReady from '@wordpress/dom-ready';
import { addFilter } from '@wordpress/hooks';
import {
	getBlockTypes,
	unregisterBlockType,
	getBlockType,
	registerBlockVariation,
	unregisterBlockVariation,
	unregisterBlockStyle,
	registerBlockStyle,
} from '@wordpress/blocks';
import lodash from 'lodash';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { unregisterFormatType } from '@wordpress/rich-text';

/**
 * Register/unregister styles
 *
 * @param {*} block
 */
const handleStyles = ( block ) => {
	const registeredBlock = getBlockType( block.name );

	// Remove all variations
	if ( lodash.isBoolean( block.styles ) && ! block.styles ) {
		registeredBlock.styles.forEach( ( style ) => {
			unregisterBlockStyle( block.name, style.name );
		} );
		return;
	}

	// Allowed styles
	const allowedStyles = block.styles.filter( ( style ) =>
		lodash.isString( style )
	);

	if ( allowedStyles.length ) {
		registeredBlock.styles.forEach( ( style ) => {
			if ( ! allowedStyles.includes( style.name ) ) {
				unregisterBlockStyle( block.name, style.name );
			}
		} );
	}

	// Custom variations
	const customStyles = block.styles.filter( ( style ) =>
		lodash.isObject( style )
	);

	if ( customStyles.length ) {
		customStyles.forEach( ( style ) => {
			registerBlockStyle( block.name, style );
		} );
	}
};

/**
 * Register/unregister variations
 *
 * @param {*} block
 */
const handleVariations = ( block ) => {
	const registeredBlock = getBlockType( block.name );

	// Remove all variations
	if ( lodash.isBoolean( block.variations ) && ! block.variations ) {
		registeredBlock.variations.forEach( ( variation ) => {
			unregisterBlockVariation( block.name, variation.name );
		} );
		return;
	}

	// Allowed variations
	const allowedVariations = block.variations.filter( ( variation ) =>
		lodash.isString( variation )
	);

	if ( allowedVariations.length ) {
		registeredBlock.variations.forEach( ( variation ) => {
			if ( ! allowedVariations.includes( variation.name ) ) {
				unregisterBlockVariation( block.name, variation.name );
			}
		} );
	}

	// Custom variations
	const customVariations = block.variations.filter( ( variation ) =>
		lodash.isObject( variation )
	);

	if ( customVariations.length ) {
		customVariations.forEach( ( variation ) => {
			registerBlockVariation( block.name, variation );
		} );
	}
};

domReady( () => {
	if ( lodash.isUndefined( blockEditorConfig ) ) {
		return;
	}

	const editorConfig = blockEditorConfig;
	const blocksConfig = lodash.has( blockEditorConfig, 'blocks' )
		? blockEditorConfig.blocks
		: [];
	const allowedBlockNames = blocksConfig.map( ( block ) => block.name );

	// Remove non whitelisted blocks
	if ( allowedBlockNames.length ) {
		getBlockTypes()
			.filter(
				( blockType ) => ! allowedBlockNames.includes( blockType.name )
			)
			.forEach( ( blockType ) => unregisterBlockType( blockType.name ) );
	}

	if ( blocksConfig.length ) {
		blocksConfig
			.filter( ( block ) => lodash.has( block, [ 'styles' ] ) )
			.forEach( handleStyles );

		blocksConfig
			.filter( ( block ) => lodash.has( block, [ 'variations' ] ) )
			.forEach( handleVariations );

		if ( lodash.has( editorConfig, [ 'formats' ] ) ) {
			const registeredFormats =
				select( 'core/rich-text' ).getFormatTypes();
			registeredFormats
				.filter(
					( format ) => ! editorConfig.formats.includes( format.name )
				)
				.forEach( ( format ) => {
					unregisterFormatType( format.name );
				} );
		}
	}
} );
