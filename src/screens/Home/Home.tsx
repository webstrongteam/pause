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

type Props = {
	navigation: NavigationScreenType
}

const Home = ({ navigation }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const translations = useSubscribe((s) => s.translations)
	const level = useSubscribe((s) => s.settings?.level)
	let points = useSubscribe((s) => s.settings?.points)

	if (!points) {
		points = 0
	}

	return (
		<View style={styles.container as ViewType}>
			<View style={styles.header as ViewType}>
				<WavyHeader variant='centered' />
			</View>
			<View>
				<PauseButton onPress={() => navigation.navigate('Profile')} />
			</View>
			<Footer currentValue={points} maxValue={1000} barColor='#F2B077'>
				<Icon
					name='account'
					onPress={() => navigation.navigate('Profile')}
					type='material-community'
					color='#fff'
					size={50}
				/>
				<Text style={styles.levelText as TextType}>
					{translations.common.level}&nbsp;{level}
				</Text>
				<Icon
					name='cog-outline'
					onPress={() => navigation.navigate('Settings')}
					type='material-community'
					color='#fff'
					size={50}
				/>
			</Footer>
		</View>
	)
}

export default Home
