import React, { useState } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './Profile.scss'

//Components
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import NextLevelBenefits from '../../components/NextLevelInfo/NextLevelInfo'
import Modal from '../../components/Modal/Modal'
import ColorButton from '../../components/ColorButton/ColorButton'

//Types
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

//Helpers
import {
	addBackgroundColor,
	addTextColor,
	getPointsToLevelUp,
	getVariety,
} from '../../utils/helpers'
import Header from '../../components/Header/Header'

type Props = {
	navigation: NavigationScreenType
}

const Profile = ({ navigation }: Props) => {
	//States
	const [modalVisible, setModalVisible] = useState(false)

	//Contexts
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()

	//Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)
	const theme = themeContext.useSubscribe((c) => c.colors)

	if (!settings) {
		return <></>
	}

	return (
		<>
			<ScrollView bounces={false} style={addBackgroundColor(styles.container, theme.primary)}>
				<Modal
					visible={modalVisible}
					title='Wybierz kolor'
					toggleModal={() => setModalVisible(false)}
					buttons={[
						{
							text: 'OK',
							onPress: () => setModalVisible(false),
						},
					]}
				>
					<View style={styles.colorConfig as ViewType}>
						<ColorButton name='primary' />
						<ColorButton name='secondary' />
						<ColorButton name='third' />
						<ColorButton name='progress' />
					</View>
				</Modal>

				<WavyHeader>
					<Header closeIconHandler={() => navigation.goBack()}>
						<Text style={addTextColor(styles.title, theme.primary)}>
							{translations.Profile.title}
						</Text>
					</Header>
				</WavyHeader>

				<Icon name='account' type='material-community' color='#fff' size={140} />
				<Text style={styles.levelText as TextType}>
					{translations.common.level}&nbsp;{settings.level}
				</Text>

				<ProgressBar
					className={styles.progressBar}
					maxValue={getPointsToLevelUp(settings.level) - getPointsToLevelUp(settings.level - 1)}
					currentValue={settings.points - getPointsToLevelUp(settings.level - 1)}
					barColor={theme.progress}
				/>

				<Text style={styles.levelInfo as TextType}>
					<Text style={styles.fontBold as TextType}>{settings.points}&nbsp;</Text>
					{getVariety(
						settings.points,
						translations.Profile.singularPoints,
						translations.Profile.pluralPoints,
						translations.Profile.genitivePoints,
					)}
				</Text>

				<Text style={styles.levelInfo as TextType}>
					<Text style={styles.fontBold as TextType}>
						{getPointsToLevelUp(settings.level) - settings.points}&nbsp;
					</Text>
					{getVariety(
						getPointsToLevelUp(settings.level) - settings.points,
						translations.Profile.singularPoints,
						translations.Profile.pluralPoints,
						translations.Profile.genitivePoints,
					)}
					<Text>&nbsp;</Text>
					{translations.Profile.toNextLvl}
				</Text>

				<NextLevelBenefits
					titleClassName={styles.nextLevelText}
					title={translations.Level.nextLevel}
					color={theme.third}
					textColor={theme.optional}
				/>
			</ScrollView>
			<View style={styles.colorConfigButtonPosition as ViewType}>
				<TouchableOpacity onPress={() => setModalVisible(true)}>
					<View style={addBackgroundColor(styles.colorConfigButton, theme.third)}>
						<Icon name='color-palette-outline' type='ionicon' color={theme.optional} size={30} />
					</View>
				</TouchableOpacity>
			</View>
		</>
	)
}

export default Profile
