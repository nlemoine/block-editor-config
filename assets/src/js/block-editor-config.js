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
	getBlockSupport,
} from '@wordpress/blocks';
import lodash from 'lodash';
import { __ } from '@wordpress/i18n';

const blocksConfig = blockEditorConfig.blocks;
const allowedBlockNames = blockEditorConfig.blocks.map(
	( block ) => block.name
);

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
 * @returns
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
	// Remove non whitelisted blocks
	getBlockTypes()
		.filter(
			( blockType ) => ! allowedBlockNames.includes( blockType.name )
		)
		.forEach( ( blockType ) => unregisterBlockType( blockType.name ) );

	blocksConfig
		.filter( ( block ) => lodash.has( block, [ 'styles' ] ) )
		.forEach( handleStyles );

	blocksConfig
		.filter( ( block ) => lodash.has( block, [ 'variations' ] ) )
		.forEach( handleVariations );
} );
