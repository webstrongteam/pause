import React from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import { getRequiredPointsToLevelUp } from '../../utils/helpers'

import styles from './Home.scss'

import WavyHeader from '../../components/WavyHeader/WavyHeader'
import PauseButton from '../../components/PauseButton/PauseButton'
import Footer from '../../components/Footer/Footer'

import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

type Props = {
	navigation: NavigationScreenType
}

const Home = ({ navigation }: Props) => {
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()

	const translations = settingsContext.useSubscribe((s) => s.translations)
	const level = settingsContext.useSubscribe((l) => l.settings?.level ?? 0)
	const points = settingsContext.useSubscribe((p) => p.settings?.points ?? 0)
	const color = themeContext.useSubscribe((c) => c.colors)

	return (
		<View style={[styles.container, { backgroundColor: color.primary }] as ViewType}>
			<View style={styles.header as ViewType}>
				<WavyHeader variant='centered' />
			</View>
			<View>
				<PauseButton onPress={() => navigation.navigate('Profile')} />
			</View>
			<Footer
				currentValue={points}
				maxValue={getRequiredPointsToLevelUp(level)}
				barColor={color.progress}
				backgroundColor={color.primary}
			>
				<Icon
					name='account'
					onPress={() => navigation.navigate('Profile')}
					type='material-community'
					color='#fff'
					size={42}
				/>
				<Text style={styles.levelText as TextType}>
					{translations.common.level}&nbsp;{level}
				</Text>
				<Icon
					name='cog-outline'
					onPress={() => navigation.navigate('Settings')}
					type='material-community'
					color='#fff'
					size={40}
				/>
			</Footer>
		</View>
	)
}

export default Home
