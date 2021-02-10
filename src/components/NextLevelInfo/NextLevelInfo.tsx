import React from 'react'
import { View, Text } from 'react-native'
import { TextType, ViewType } from '../../types/styles'
import styles from './NextLevelInfo.scss'

const NextLevelInfo = () => (
	<View>
		<View style={styles.nextLevelInfo as ViewType}>
			<Text style={styles.nextLevelInfoText as TextType}>Nowy utwór muzyczny</Text>
		</View>
		<View style={styles.nextLevelInfo as ViewType}>
			<Text style={styles.nextLevelInfoText as TextType}>2 nowe ćwiczenia</Text>
		</View>
		<View style={styles.nextLevelInfo as ViewType}>
			<Text style={styles.nextLevelInfoText as TextType}>Nowe kolory aplikacji</Text>
		</View>
	</View>
)

export default NextLevelInfo
