const path = require( 'node:path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );
const { WebpackManifestPlugin } = require( 'webpack-manifest-plugin' );

module.exports = {
	...defaultConfig,
	...{
		context: path.resolve( process.cwd(), 'assets', 'src' ),
		entry: {
			'block-editor-config': [
				path.resolve(
					process.cwd(),
					'assets',
					'src',
					'js',
					'block-editor-config.js'
				),
			],
		},
		output: {
			filename: '[name]-[contenthash].js',
			path: path.resolve( process.cwd(), 'assets', 'dist' ),
			clean: true,
		},
	},
	plugins: [
		...defaultConfig.plugins,
		new WebpackManifestPlugin( {
			basePath: '',
			publicPath: '',
		} ),
	],
};
