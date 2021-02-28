import React from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

import styles from './Home.scss'

import WavyHeader from '../../components/WavyHeader/WavyHeader'
import PauseButton from '../../components/PauseButton/PauseButton'
import Footer from '../../components/Footer/Footer'

import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'
import { usePauseContext } from '../../utils/context/PauseContext'

type Props = {
	navigation: NavigationScreenType
}

const Home = ({ navigation }: Props) => {
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()
	const pauseContext = usePauseContext()

	const translations = settingsContext.useSubscribe((s) => s.translations)
	const level = settingsContext.useSubscribe((l) => l.settings?.level)
	let points = settingsContext.useSubscribe((p) => p.settings?.points)
	const color = themeContext.useSubscribe((c) => c.colors)
	let maxPoints = pauseContext.useSubscribe((m) => m.exercise?.requiredLevel)

	return (
		<View style={[styles.container, { backgroundColor: color.primary }] as ViewType}>
			<View style={styles.header as ViewType}>
				<WavyHeader variant='centered' />
			</View>
			<View>
				<PauseButton onPress={() => navigation.navigate('Profile')} />
			</View>
			<Footer
				currentValue={!points ? (points = 0) : points}
				maxValue={!maxPoints ? (maxPoints = 0) : maxPoints}
				barColor={color.progress}
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
					size={42}
				/>
			</Footer>
		</View>
	)
}

export default Home
