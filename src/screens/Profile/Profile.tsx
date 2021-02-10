import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import { TextType, ViewType } from '../../types/styles'
import styles from './Profile.scss'
import ProgressBar from '../../components/ProgressBar/ProgressBar'

const Profile = () => (
	<ScrollView style={styles.container as ViewType}>
		<WavyHeader />
		<View style={styles.header as ViewType}>
			<Icon name='x' type='feather' color='#1A6A73' size={40} />
			<Text style={styles.label as TextType}>PROFIL</Text>
		</View>
		<Icon name='account' type='material-community' color='#fff' size={140} />
		<Text style={styles.levelText as TextType}>Poziom 3</Text>
		<ProgressBar maxValue={1000} currentValue={300} barColor='#F2B077' />
		<Text style={styles.levelInfo as TextType}>
			<Text style={styles.fontBold as TextType}>1280 </Text>
            punktów
		</Text>
		<Text style={styles.levelInfo as TextType}>
			<Text style={styles.fontBold as TextType}>231 </Text>
            punkty do następnego poziomu
		</Text>
		<Text style={styles.nextLevelText as TextType}>Następny poziom:</Text>
		<View style={styles.nextLevelInfo as ViewType}>
			<Text style={styles.nextLevelInfoText as TextType}>Nowy utwór muzyczny</Text>
		</View>
		<View style={styles.nextLevelInfo as ViewType}>
			<Text style={styles.nextLevelInfoText as TextType}>2 nowe ćwiczenia</Text>
		</View>
		<View style={styles.nextLevelInfo as ViewType}>
			<Text style={styles.nextLevelInfoText as TextType}>Nowe kolory aplikacji</Text>
		</View>
	</ScrollView>
)

export default Profile
