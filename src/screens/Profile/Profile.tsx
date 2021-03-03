import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './Profile.scss'

//Components
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'
import NextLevelBenefits from '../../components/NextLevelInfo/NextLevelInfo'

//Types
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

//Helpers
import {
	addBackgroundColor,
	addTextColor,
	getPointsToLevelUp,
	getVariety,
} from '../../utils/helpers'

type Props = {
	navigation: NavigationScreenType
}

const Profile = ({ navigation }: Props) => {
	//Contexts
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()

	//Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)

	const theme = themeContext.useSubscribe((c) => c.colors)

	if (!settings) {
		return <></>
	}

	return (
		<ScrollView bounces={false} style={addBackgroundColor(styles.container, theme.primary)}>
			<WavyHeader>
				<View style={styles.headerContainer as ViewType}>
					<View style={styles.header as ViewType}>
						<CloseIcon onPress={() => navigation.goBack()} />
						<Text style={addTextColor(styles.title, theme.primary)}>
							{translations.Profile.title}
						</Text>
					</View>
				</View>
			</WavyHeader>

			<Icon name='account' type='material-community' color='#fff' size={140} />
			<Text style={styles.levelText as TextType}>
				{translations.common.level}&nbsp;{settings.level}
			</Text>

			<ProgressBar
				className={styles.progressBar}
				maxValue={getPointsToLevelUp(settings.level)}
				currentValue={settings.points}
				barColor={theme.progress}
			/>

			<Text style={styles.levelInfo as TextType}>
				{getVariety(
					settings.points,
					translations.Profile.singularPoints,
					translations.Profile.plurarPoints,
					translations.Profile.genitivePoints,
				)}
			</Text>

			<Text style={styles.levelInfo as TextType}>
				{getVariety(
					getPointsToLevelUp(settings.level) - settings.points,
					translations.Profile.singularPointsToNextLvl,
					translations.Profile.plurarPointsToNextLvl,
					translations.Profile.genitivePointsToNextLvl,
				)}
			</Text>

			<NextLevelBenefits
				titleClassName={styles.nextLevelText}
				title={translations.Level.nextLevel}
			/>
		</ScrollView>
	)
}

export default Profile
