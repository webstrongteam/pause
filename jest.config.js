module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json',
		},
	},
	moduleFileExtensions: ['js', 'ts'],
	transform: {
		'^.+\\.(ts)$': 'ts-jest',
	},
	transformIgnorePatterns: [
		'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)',
	],
	testMatch: ['**/__tests__/**/*.spec.(ts)'],
	preset: 'jest-expo',
	reporters: ['default', ['jest-junit', { outputDirectory: 'reports/tests' }]],
	resetMocks: true,
	coverageDirectory: 'reports/coverage',
	moduleNameMapper: {
		'^config(.*)$': '<rootDir>/src/config$1',
	},
}
