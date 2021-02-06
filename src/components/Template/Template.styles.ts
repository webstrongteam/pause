import { Platform, StatusBar, StyleSheet } from 'react-native'

export default StyleSheet.create({
	container: {
		flex: 1,
	},
	statusBar: {
		height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
	},
})
