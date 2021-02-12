import React, { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Icon, ButtonGroup, Button } from 'react-native-elements'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import styles from './Settings.scss'
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

type Props = {
	navigation: NavigationScreenType
}

// const {useSubscribe, setSettings} = useSettingsContext()
// const settings = useSubscribe(s => s.settings)
// const translations = useSubscribe(s => s.translations)
//
// const changeLanguageHandler = async (lang: Lang) => {
// 	const newSettings = await changeLanguage(lang)
// 	setSettings(newSettings)
// }

const Settings = ({ navigation }: Props) => {
	const [languageIndex, setLanguageIndex] = useState(0)
	const [difficultyIndex, setDifficultyIndex] = useState(0)
	const [breakTimeIndex, setBreakTimeIndex] = useState(0)

	const indexes = [languageIndex, difficultyIndex, breakTimeIndex]
	const buttonGroupStyles = [styles.languages, styles.difficulty, styles.breakTime]
	const sets = [setLanguageIndex, setDifficultyIndex, setBreakTimeIndex]
	const labels = ['Język', 'Poziom trudności', 'Czas trwania przerwy']
	const buttons = [
		['Polski', 'Angielski'],
		['Łatwy', 'Średni', 'Trudny'],
		['Krótki', 'Średni', 'Długi'],
	]

	return (
		<ScrollView style={styles.container as ViewType}>
			<WavyHeader />
			<View style={styles.header as ViewType}>
				<CloseIcon onPress={() => navigation.goBack()} />
				<Text style={styles.title as TextType}>Profil</Text>
			</View>
			<View style={styles.settings as ViewType}>
				{labels.map((val, i) => (
					<View key={i}>
						<Text style={styles.label as TextType}>{val}</Text>
						<ButtonGroup
							onPress={(num) => sets[i](num)}
							buttons={buttons[i]}
							selectedIndex={indexes[i]}
							containerStyle={buttonGroupStyles[i] as ViewType}
							selectedButtonStyle={styles.selectedButton as ViewType}
							selectedTextStyle={{ color: '#1A6A73' }}
							textStyle={{ fontSize: 16 }}
						/>
					</View>
				))}
			</View>
			<Button
				icon={<Icon name='trash-o' type='font-awesome' color='#5a5a5a' />}
				iconRight
				title='Wyczyść dane'
				buttonStyle={styles.buttonStyles as ViewType}
				titleStyle={styles.buttonTitle as TextType}
			/>
		</ScrollView>
	)
}
export default Settings
