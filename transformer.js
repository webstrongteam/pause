const upstreamTransformer = require('metro-react-native-babel-transformer')
const sassTransformer = require('react-native-sass-transformer')

module.exports.transform = function ({ src, filename, options }) {
	if (filename.endsWith('.scss') || filename.endsWith('.sass')) {
		const opts = Object.assign(options, {
			sassOptions: {
				functions: {
					'rem($px)': (px) => {
						px.setValue(px.getValue() / 16)
						px.setUnit('rem')
						return px
					},
				},
			},
		})
		return sassTransformer.transform({ src, filename, options: opts })
	}
	return upstreamTransformer.transform({ src, filename, options })
}
