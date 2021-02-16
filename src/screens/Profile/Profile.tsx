import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import { TextType, ViewType } from '../../types/styles'
import styles from './Profile.scss'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'
import NextLevelInfo from '../../components/NextLevelInfo/NextLevelInfo'
import { NavigationScreenType } from '../../types/navigation'

type Props = {
	navigation: NavigationScreenType
}

const Profile = ({ navigation }: Props) => (
	<ScrollView bounces={false} style={styles.container as ViewType}>
		<WavyHeader />

		<View style={styles.headerContainer as ViewType}>
			<View style={styles.header as ViewType}>
				<CloseIcon onPress={() => navigation.goBack()} />
				<Text style={styles.title as TextType}>PROFIL</Text>
			</View>
		</View>
		

		<Icon name='account' type='material-community' color='#fff' size={140} />
		<Text style={styles.levelText as TextType}>Poziom 3</Text>
		<ProgressBar maxValue={1000} currentValue={300} barColor='#F2B077' />

		<Text style={styles.levelInfo as TextType}>
			<Text style={styles.fontBold as TextType}>1280 </Text>
			<Text>punktów</Text>
		</Text>

		<Text style={styles.levelInfo as TextType}>
			<Text style={styles.fontBold as TextType}>231 </Text>
			<Text>punkty do następnego poziomu</Text>
		</Text>

		<Text style={styles.nextLevelText as TextType}>Następny poziom:</Text>
		<NextLevelInfo
			levelBenefits={['Nowy utwór muzyczny', '2 nowe ćwiczenia', 'Nowy kolor aplikacji']}
		/>
	</ScrollView>
)

export default Profile
