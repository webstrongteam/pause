import React from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextType, ViewType } from '../../types/styles'
import {NavigationScreenType} from '../../types/navigation'

import styles from './Home.scss'

import ProgressBar from '../../components/ProgressBar/ProgressBar'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import PauseButton from '../../components/PauseButton/PauseButton'

type Props={
	navigation:NavigationScreenType
}

const Home = ({navigation}:Props) => (

	<View style={styles.container as ViewType}>
		<WavyHeader />
		<View style={styles.pauseButton as ViewType}>
			<PauseButton />
		</View>

		<View style={styles.progressBar as ViewType}>
			<ProgressBar maxValue={1000} currentValue={300} barColor='#F2B077' />
			<View style={styles.bottomInfo as ViewType}>
				<Icon name='account' onPress={()=>navigation.navigate("Profile")} type='material-community' color='#fff' size={50} />
				<Text style={styles.levelText as TextType}>Poziom 3</Text>
				<Icon name='cog-outline' onPress={()=>navigation.navigate("Settings")} type='material-community' color='#fff' size={50} />
			</View>
		</View>
	</View>
)

export default Home
