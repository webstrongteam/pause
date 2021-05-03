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
	emptyBenefitsText?: string
	color: string
	textColor: string
	titleClassName?: TextType | {}
}

const NextLevelBenefits = ({
	title,
	color,
	textColor,
	emptyBenefitsText,
	titleClassName,
}: Props) => {
	const { useSubscribe } = useSettingsContext()
	const translations = useSubscribe((s) => s.translations.common)
	const level = useSubscribe((s) => s.settings?.level)

	if (!level) {
		return <></>
	}

	const levelBenefits = getNextLevelBenefits(level)

	if (!levelBenefits.themes && !levelBenefits.music && !levelBenefits.exercises) {
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

			{!!levelBenefits.music && (
				<View style={addBackgroundColor(styles.nextLevelInfo, color)}>
					<Text style={addTextColor(styles.nextLevelInfoText, textColor)}>
						{levelBenefits.music > 1 && <Text>{levelBenefits.music}&nbsp;</Text>}
						{getVariety(
							levelBenefits.music,
							translations.singularNewMusic,
							translations.pluralNewMusic,
							translations.genitiveNewMusic,
						)}
					</Text>
				</View>
			)}

			{!!levelBenefits.themes && (
				<View style={addBackgroundColor(styles.nextLevelInfo, color)}>
					<Text style={addTextColor(styles.nextLevelInfoText, textColor)}>
						{levelBenefits.themes > 1 && <Text>{levelBenefits.themes}&nbsp;</Text>}
						{getVariety(
							levelBenefits.themes,
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
