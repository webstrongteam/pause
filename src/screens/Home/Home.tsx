import React from 'react'
import { View, Text } from 'react-native'
import { TextType, ViewType } from '../../types/styles'
import styles from './Home.scss'

const Home = () => (
	// const { useSubscribe } = useSettingsContext()
	// const settings = useSubscribe((s) => s.settings)
	// const translations = useSubscribe((s) => s.translations)

	<View style={styles.container as ViewType}>
		<Text style={styles.heading as TextType}>Home</Text>
	</View>
)

export default Home
