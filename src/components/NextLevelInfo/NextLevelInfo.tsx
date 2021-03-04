import React from 'react'
import { View, Text } from 'react-native'
import { TextType, ViewType } from '../../types/styles'
import { concatStyles, getNextLevelBenefits, getVariety } from '../../utils/helpers'
import { useSettingsContext } from '../../utils/context/SettingsContext'
import styles from './NextLevelInfo.scss'

type Props = {
	title: string
	titleClassName?: {}
}

const NextLevelBenefits = ({ title, titleClassName }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const translations = useSubscribe((s) => s.translations.common)
	const level = useSubscribe((s) => s.settings?.level)

	if (!level) {
		return <></>
	}

	const levelBenefits = getNextLevelBenefits(level)

	if (!levelBenefits.themes && !levelBenefits.music && !levelBenefits.exercises) {
		return <></>
	}

	return (
		<View>
			<Text style={concatStyles(styles.title, titleClassName)}>{title}</Text>

			{!!levelBenefits.exercises && (
				<View style={styles.nextLevelInfo as ViewType}>
					<Text style={styles.nextLevelInfoText as TextType}>
						{levelBenefits.exercises}
						<Text>&nbsp;</Text>
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
				<View style={styles.nextLevelInfo as ViewType}>
					<Text style={styles.nextLevelInfoText as TextType}>
						{levelBenefits.music}
						<Text>&nbsp;</Text>
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
				<View style={styles.nextLevelInfo as ViewType}>
					<Text style={styles.nextLevelInfoText as TextType}>
						{levelBenefits.themes}
						<Text>&nbsp;</Text>
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
