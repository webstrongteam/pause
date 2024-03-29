import React, { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Icon, ButtonGroup, Button } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Components
import Wavy from '../../components/Wavy/Wavy'
import Modal from '../../components/Modal/Modal'

// Types and styles
import styles from './Settings.scss'
import { TextType, ViewType } from '../../types/styles'
import { Difficulty, Lang, Time, Settings } from '../../types/settings'
import { NavigationScreenType } from '../../types/navigation'

// Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

import {
	changeLanguage,
	changeDifficulty,
	changeTime,
	restartSettings,
} from '../../../database/actions/settings'
import useShowFailureMessage from '../../utils/hooks/useShowFailureMessage'
import useShowMessage from '../../utils/hooks/useShowMessage'
import Header from '../../components/Header/Header'
import { addBackgroundColor, addTextColor } from '../../utils/helpers'
import { defaultTheme, optionalColor } from '../../utils/consts'
import { restartTheme } from '../../../database/actions/theme'
import { sentryError } from '../../utils/sentryEvent'
import logEvent from '../../utils/logEvent'
import { VERSION } from '../../../database/db'

type Props = {
	navigation: NavigationScreenType
}

type ButtonGroupsType = Record<
	string,
	{
		label: string
		onPress: () => void
		name: Lang | Difficulty | Time
		key: keyof Settings
	}[]
>

const SettingsScreen = ({ navigation }: Props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const { useSubscribe, setSettings } = useSettingsContext()
	const themeContext = useThemeContext()

	const settings = useSubscribe((s) => s.settings)
	const translations = useSubscribe((s) => s.translations)
	const theme = themeContext.useSubscribe((t) => t)

	if (!settings) {
		sentryError('Missing data from context in Settings')
		return <></>
	}

	const showFailureMessage = useShowFailureMessage()
	const showMessage = useShowMessage({
		message: translations.Settings.settingsRestore,
		backgroundColor: defaultTheme[0],
	})

	const buttonGroupStyles = [
		addBackgroundColor(styles.languages, theme.third),
		addBackgroundColor(styles.difficulty, theme.third),
		addBackgroundColor(styles.breakTime, theme.third),
	]

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

	const resetSettingsHandler = async () => {
		try {
			await logEvent('Reset settings and theme', {
				component: 'Settings',
			})

			await AsyncStorage.clear()
			setSettings(await restartSettings())
			themeContext.setTheme(await restartTheme())
			showMessage()
		} catch (error) {
			sentryError(error)
			showFailureMessage()
		}

		setModalVisible(false)
	}

	return (
		<>
			<ScrollView style={addBackgroundColor(styles.container, theme.primary)}>
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
							onPress: resetSettingsHandler,
						},
					]}
				>
					<View style={styles.Modal as ViewType}>
						<Text style={styles.ModalText as TextType}>
							{translations.Settings.clearDataDescription}
						</Text>
					</View>
				</Modal>

				<Wavy>
					<Header closeIconHandler={() => navigation.replace('Home')}>
						<Text style={addTextColor(styles.title, theme.primary)}>
							{translations.Settings.title}
						</Text>
					</Header>
				</Wavy>

				<View style={styles.settings as ViewType}>
					{Object.keys(buttonGroups).map((key, index) => (
						<View key={index}>
							<Text style={addTextColor(styles.label, theme.secondary)}>{key}</Text>
							<ButtonGroup
								onPress={(i) => buttonGroups[key][i].onPress()}
								buttons={buttonGroups[key].map((button) => button.label)}
								selectedIndex={buttonGroups[key].findIndex(
									(button) => button.name === settings[button.key],
								)}
								containerStyle={buttonGroupStyles[index]}
								selectedButtonStyle={addBackgroundColor(styles.selectedButton, theme.secondary)}
								selectedTextStyle={{ color: theme.primary }}
								textStyle={styles.buttonGroupText as TextType}
							/>
						</View>
					))}

					<View style={styles.versionWrapper as ViewType}>
						<Text style={addTextColor(styles.version, theme.third)}>
							{translations.Settings.version}: {VERSION}
						</Text>
					</View>
				</View>
			</ScrollView>

			<View style={styles.clearButtonPosition as ViewType}>
				<Button
					icon={<Icon name='trash-o' type='font-awesome' color='#5a5a5a' />}
					iconRight
					onPress={() => setModalVisible(true)}
					title={translations.Settings.clearData}
					buttonStyle={addBackgroundColor(styles.buttonStyles, theme.third)}
					titleStyle={addTextColor(styles.buttonTitle, optionalColor)}
				/>
			</View>
		</>
	)
}

export default SettingsScreen
