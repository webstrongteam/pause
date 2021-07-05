import React from 'react'
import { View, Text } from 'react-native'
import {
	addBackgroundColor,
	addTextColor,
	getNextLevelBenefits,
	getVariety,
} from '../../utils/helpers'
import { useSettingsContext } from '../../utils/context/SettingsContext'
import styles from './NextLevelInfo.scss'
import { TextType } from '../../types/styles'

type Props = {
	title?: string
	level: number
	emptyBenefitsText?: string
	color: string
	textColor: string
	titleClassName?: TextType | {}
}

const NextLevelBenefits = ({
	title,
	level,
	color,
	textColor,
	emptyBenefitsText,
	titleClassName,
}: Props) => {
	const { useSubscribe } = useSettingsContext()
	const translations = useSubscribe((s) => s.translations.common)

	const levelBenefits = getNextLevelBenefits(level)

	if (!levelBenefits.colors && !levelBenefits.exercises) {
		if (emptyBenefitsText) {
			return <Text style={[styles.title, titleClassName]}>{emptyBenefitsText}</Text>
		}
		return <></>
	}

	return (
		<View>
			<Text style={[styles.title, titleClassName]}>{title}</Text>

			{!!levelBenefits.exercises && (
				<View style={addBackgroundColor(styles.nextLevelInfo, color)}>
					<Text style={addTextColor(styles.nextLevelInfoText, textColor)}>
						{levelBenefits.exercises > 1 && <Text>{levelBenefits.exercises}&nbsp;</Text>}
						{getVariety(
							levelBenefits.exercises,
							translations.singularNewExercise,
							translations.pluralNewExercises,
							translations.genitiveNewExercises,
						)}
					</Text>
				</View>
			)}

			{!!levelBenefits.colors && (
				<View style={addBackgroundColor(styles.nextLevelInfo, color)}>
					<Text style={addTextColor(styles.nextLevelInfoText, textColor)}>
						{levelBenefits.colors > 1 && <Text>{levelBenefits.colors}&nbsp;</Text>}
						{getVariety(
							levelBenefits.colors,
							translations.singularNewTheme,
							translations.pluralNewThemes,
							translations.genitiveNewThemes,
						)}
					</Text>
				</View>
			)}
		</View>
	)
}

export default NextLevelBenefits
