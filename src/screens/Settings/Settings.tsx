import React, { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Icon, ButtonGroup, Button } from 'react-native-elements'
import CloseIcon from '../../components/UI/CloseIcon/CloseIcon'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import styles from './Settings.scss'
import { TextType, ViewType } from '../../types/styles'
import { Difficulty, Lang, Time, Settings } from '../../types/settings'
import { NavigationScreenType } from '../../types/navigation'
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { changeLanguage, changeDifficulty, changeTime } from '../../../database/actions/settings'
import Modal from '../../components/Modal/Modal'

type Props = {
	navigation: NavigationScreenType
}

const SettingsScreen = ({ navigation }: Props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const { useSubscribe, setSettings } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)
	const translations = useSubscribe((s) => s.translations)

	const buttonGroupStyles = [styles.languages, styles.difficulty, styles.breakTime]

	type ButtonGroupsType = Record<
		string,
		{
			label: string
			onPress: () => void
			name: Lang | Difficulty | Time
			key: keyof Settings
		}[]
	>

	const buttonGroups: ButtonGroupsType = {
		[translations.Settings.language]: [
			{
				label: translations.Settings.pol,
				onPress: async () => setSettings(await changeLanguage('pl')),
				name: 'pl',
				key: 'lang',
			},
			{
				label: translations.Settings.eng,
				onPress: async () => setSettings(await changeLanguage('en')),
				name: 'en',
				key: 'lang',
			},
		],
		[translations.Settings.difficulty]: [
			{
				label: translations.Settings.easy,
				onPress: async () => setSettings(await changeDifficulty('easy')),
				name: 'easy',
				key: 'difficulty',
			},
			{
				label: translations.Settings.medium,
				onPress: async () => setSettings(await changeDifficulty('medium')),
				name: 'medium',
				key: 'difficulty',
			},
			{
				label: translations.Settings.hard,
				onPress: async () => setSettings(await changeDifficulty('hard')),
				name: 'hard',
				key: 'difficulty',
			},
		],
		[translations.Settings.breakDurationTime]: [
			{
				label: translations.Settings.short,
				onPress: async () => setSettings(await changeTime('short')),
				name: 'short',
				key: 'time',
			},
			{
				label: translations.Settings.medium,
				onPress: async () => setSettings(await changeTime('medium')),
				name: 'medium',
				key: 'time',
			},
			{
				label: translations.Settings.long,
				onPress: async () => setSettings(await changeTime('long')),
				name: 'long',
				key: 'time',
			},
		],
	}

	return (
		<>
			<ScrollView style={styles.container as ViewType}>
				<Modal
					visible={modalVisible}
					title={translations.Settings.clearData}
					toggleModal={() => setModalVisible(false)}
					buttons={[
						{
							text: translations.common.no,
							onPress: () => setModalVisible(false),
						},
						{
							text: translations.common.yes,
							onPress: () => setModalVisible(false),
						},
					]}
				>
					<View style={styles.Modal as ViewType}>
						<Text style={styles.ModalText as TextType}>
							{translations.Settings.clearDataDescription}
						</Text>
					</View>
				</Modal>
				<WavyHeader />
				<View style={styles.header as ViewType}>
					<CloseIcon onPress={() => navigation.goBack()} />
					<Text style={styles.title as TextType}>{translations.Settings.title}</Text>
				</View>
				<View style={styles.settings as ViewType}>
					{settings &&
						Object.keys(buttonGroups).map((key, index) => (
							<View key={index}>
								<Text style={styles.label as TextType}>{key}</Text>
								<ButtonGroup
									onPress={(i) => buttonGroups[key][i].onPress()}
									buttons={buttonGroups[key].map((button) => button.label)}
									selectedIndex={buttonGroups[key].findIndex(
										(button) => button.name === settings[button.key],
									)}
									containerStyle={buttonGroupStyles[index] as ViewType}
									selectedButtonStyle={styles.selectedButton as ViewType}
									selectedTextStyle={{ color: '#1A6A73' }}
									textStyle={{ fontSize: 16 }}
								/>
							</View>
						))}
				</View>
			</ScrollView>
			<View style={styles.clearButtonPosition as ViewType}>
				<Button
					icon={<Icon name='trash-o' type='font-awesome' color='#5a5a5a' />}
					iconRight
					onPress={() => setModalVisible(true)}
					title={translations.Settings.clearData}
					buttonStyle={styles.buttonStyles as ViewType}
					titleStyle={styles.buttonTitle as TextType}
				/>
			</View>
		</>
	)
}
export default SettingsScreen
