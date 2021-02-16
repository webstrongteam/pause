import React from 'react'
import { View, Text } from 'react-native'
import { TextType, ViewType } from '../../types/styles'
import { Icon } from 'react-native-elements'

import styles from './Home.scss'

import ProgressBar from '../../components/ProgressBar/ProgressBar';
import WavyHeader from '../../components/WavyHeader/WavyHeader';
import PauseButton from '../../components/PauseButton/PauseButton';

const Home = () => (
	// const { useSubscribe } = useSettingsContext()
	// const settings = useSubscribe((s) => s.settings)
	// const translations = useSubscribe((s) => s.translations)

	<View style={styles.container as ViewType}>
			<WavyHeader/>
			<View style={styles.pauseButton as ViewType}>
				<PauseButton/>
			</View>

			<View style={styles.progressBar as ViewType}>
				<ProgressBar maxValue={1000} currentValue={300} barColor='#F2B077'/>
				<View style={styles.bottomInfo as ViewType}>
					<Icon name='account' type='material-community' color='#fff' size={50} />
					<Text style={styles.levelText as TextType}>Poziom 3</Text>
					<Icon name='cog-outline' type='material-community' color='#fff' size={50}/>
				</View>
			</View>		
	</View>
)

export default Home
