import React from 'react'
import { View, Text } from 'react-native'
import { TextType, ViewType } from '../../types/styles'
import styles from './NextLevelInfo.scss'

type Props = {
	levelBenefits: string[]
}

const NextLevelInfo = ({ levelBenefits }: Props) => (
	<View>
		{levelBenefits.map((benefit: string, index: number) => (
			<View key={index} style={styles.nextLevelInfo as ViewType}>
				<Text style={styles.nextLevelInfoText as TextType}>{benefit}</Text>
			</View>
		))}
	</View>
)

export default NextLevelInfo
