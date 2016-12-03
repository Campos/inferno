/* global module */
/* tslint:disable */

const customLaunchers = {
	sl_chrome: {
		base: 'SauceLabs',
		browserName: 'chrome',
		platform: 'Windows 10'
	},
	sl_firefox: {
		base: 'SauceLabs',
		browserName: 'firefox',
		platform: 'Windows 10'
	},
	sl_safari: {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.11'
	},
	sl_edge: {
		base: 'SauceLabs',
		browserName: 'MicrosoftEdge',
		platform: 'Windows 10'
	},
	sl_ie_11: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		version: '11.103',
		platform: 'Windows 10'
	},
	sl_ie_10: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		version: '10.0',
		platform: 'Windows 7'
	},
	sl_ie_9: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		version: '9.0',
		platform: 'Windows 7'
	}
};

module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'chai',
			'mocha',
		],
		files: [
			'./../node_modules/babel-polyfill/dist/polyfill.js',
			'./../node_modules/sinon/pkg/sinon.js',
			'./../src/**/*__tests__*/**/*.ts',
			'./../src/**/*__tests__*/**/*.tsx',
			'./../src/**/*__tests__*/**/*.js',
			'./../src/**/*__tests__*/**/*.jsx',
		],
		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera (has to be installed with `npm install karma-opera-launcher`)
		// - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
		// - PhantomJS
		// - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
		browsers: ['Chrome'],
		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox'],
			},
		},
		// list of files to exclude
		exclude: [],
		preprocessors: {
			'./../src/**/*__tests__*/**/*.ts': ['webpack'],
			'./../src/**/*__tests__*/**/*.tsx': ['webpack'],
			'./../src/**/*__tests__*/**/*.js': ['webpack'],
			'./../src/**/*__tests__*/**/*.jsx': ['webpack'],
		},
		webpack: {
			module: {
				loaders: [
					{
						test: /\.tsx?$/,
						loaders: ['babel-loader', 'ts-loader'],
						exclude: /node_modules/,
					}, {
						test: /\.jsx?$/,
						loader: 'babel-loader',
						exclude: /node_modules/,
					},
				],
			},
			resolve: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
		webpackMiddleware: {
			noInfo: true,
			stats: {
				// With console colors
				colors: true,
				// Add the hash of the compilation
				hash: false,
				// Add webpack version information
				version: false,
				// Add timing information
				timings: true,
				// Add assets information
				assets: false,
				// Add chunk information
				chunks: false,
				// Add built modules information to chunk information
				chunkModules: false,
				// Add built modules information
				modules: false,
				// Add also information about cached (not built) modules
				cached: false,
				// Add information about the reasons why modules are included
				reasons: false,
				// Add the source code of modules
				source: false,
				// Add details to errors (like resolving log)
				errorDetails: true,
				// Add the origins of chunks and chunk merging info
				chunkOrigins: false,
				// Add messages from child loaders
				children: false,
			},
		},
		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

		browserDisconnectTimeout: 10000,
		browserDisconnectTolerance: 2,
		// concurrency level how many browser should be started simultaneously
		concurrency: 4,
		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 100000,
		browserNoActivityTimeout: 30000,
		// enable / disable colors in the output (reporters and logs)
		colors: true,
		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,
		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,
	});

	if (process.env.TRAVIS) {
		config.browsers = ['Chrome_travis_ci'];
		// Used by Travis to push coveralls info corretly to example coveralls.io
		// Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
		config.browserNoActivityTimeout = 120000;
	}

	console.log(process.env.TRAVIS, process.env.TRAVIS_PULL_REQUEST);
	if (process.env.TRAVIS && !process.env.TRAVIS_PULL_REQUEST) {
		console.log("Running with Sauce Labs");
		if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
			console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
			process.exit(1)
		}
		
		config.set({
			port: 9876,
			sauceLabs: {
        testName: 'Inferno Tests',
			},
			customLaunchers: customLaunchers,
			browsers: Object.keys(customLaunchers),
			reporters: [
				'dots',
				'saucelabs',
			],
		});
	}
};
