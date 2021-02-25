import React from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

import styles from './Home.scss'

import WavyHeader from '../../components/WavyHeader/WavyHeader'
import PauseButton from '../../components/PauseButton/PauseButton'
import Footer from '../../components/Footer/Footer'

type Props = {
	navigation: NavigationScreenType
}

const Home = ({ navigation }: Props) => (
	<View style={styles.container as ViewType}>
		<View style={{ position: 'absolute', top: 0, width: '100%' }}>
			<WavyHeader variant='centered' />
		</View>
		<View style={{ height: '100%' }}>
			<PauseButton />
		</View>

		<Footer currentValue={300} maxValue={1000} barColor='#F2B077'>
			<Icon
				name='account'
				onPress={() => navigation.navigate('Profile')}
				type='material-community'
				color='#fff'
				size={50}
			/>
			<Text style={styles.levelText as TextType}>Poziom 3</Text>
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

export default Home
