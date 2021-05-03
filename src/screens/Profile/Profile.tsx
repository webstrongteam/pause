import React, { useState } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { BoxShadow } from 'react-native-shadow'
import styles from './Profile.scss'

//Components
import Header from '../../components/Header/Header'
import WavyHeader from '../../components/WavyHeader/WavyHeader'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import NextLevelBenefits from '../../components/NextLevelInfo/NextLevelInfo'
import Modal from '../../components/Modal/Modal'
import ColorButton from '../../components/ThemeConfigurator/ColorButton/ColorButton'
import ColorOptions from '../../components/ThemeConfigurator/ColorOptions/ColorOptions'

//Types
import { TextType, ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import { ColorType } from '../../types/theme'

//Contexts
import { useSettingsContext } from '../../utils/context/SettingsContext'
import { useThemeContext } from '../../utils/context/ThemeContext'

//Utils
import {
	addBackgroundColor,
	addTextColor,
	pickTextColor,
	getPointsToLevelUp,
	getVariety,
	getShadowOpt,
} from '../../utils/helpers'
import { optionalColor } from '../../utils/consts'

type Props = {
	navigation: NavigationScreenType
}

const Profile = ({ navigation }: Props) => {
	//States
	const [modalVisible, setModalVisible] = useState(false)
	const [isColorPicked, setIsColorPicked] = useState(false)
	const [selectedColorType, setSelectedColorType] = useState<ColorType>('primary')

	//Contexts
	const settingsContext = useSettingsContext()
	const themeContext = useThemeContext()

	//Subscribes
	const translations = settingsContext.useSubscribe((s) => s.translations)
	const settings = settingsContext.useSubscribe((s) => s.settings)!
	const theme = themeContext.useSubscribe((t) => t)

	//Functions
	const colorPickHandler = (colorType: ColorType) => {
		setSelectedColorType(colorType)
		setIsColorPicked(true)
	}
	const closeModal = () => {
		setModalVisible(false)
		setIsColorPicked(false)
	}

	return (
		<>
			<ScrollView bounces={false} style={addBackgroundColor(styles.container, theme.primary)}>
				<Modal
					visible={modalVisible}
					title={translations.Profile.chooseColor}
					toggleModal={closeModal}
					buttons={[
						{
							text: 'Ok',
							onPress: isColorPicked ? () => setIsColorPicked(false) : closeModal,
						},
					]}
				>
					{isColorPicked ? (
						<View style={styles.colorPicker as ViewType}>
							<Text style={styles.colorName as TextType}>
								{translations.Profile[selectedColorType]}
							</Text>
							<ColorOptions type={selectedColorType} />
						</View>
					) : (
						<View style={styles.colorConfig as ViewType}>
							<ColorButton name='primary' onPress={() => colorPickHandler('primary')} />
							<ColorButton name='secondary' onPress={() => colorPickHandler('secondary')} />
							<ColorButton name='third' onPress={() => colorPickHandler('third')} />
							<ColorButton name='progress' onPress={() => colorPickHandler('progress')} />
						</View>
					)}
				</Modal>

				<WavyHeader bgColor={theme.secondary}>
					<Header closeIconHandler={() => navigation.goBack()}>
						<Text style={addTextColor(styles.title, theme.primary)}>
							{translations.Profile.title}
						</Text>
					</Header>
				</WavyHeader>

				<Icon
					name='account'
					type='material-community'
					color={pickTextColor(theme.primary)}
					size={140}
				/>
				<Text style={addTextColor(styles.levelText, pickTextColor(theme.primary))}>
					{translations.common.level}&nbsp;{settings.level}
				</Text>

				<ProgressBar
					className={styles.progressBar}
					maxValue={getPointsToLevelUp(settings.level) - getPointsToLevelUp(settings.level - 1)}
					currentValue={settings.points - getPointsToLevelUp(settings.level - 1)}
					barColor={theme.progress}
				/>

				<Text style={addTextColor(styles.levelInfo, pickTextColor(theme.primary))}>
					<Text style={styles.fontBold as TextType}>{settings.points}&nbsp;</Text>
					{getVariety(
						settings.points,
						translations.Profile.singularPoints,
						translations.Profile.pluralPoints,
						translations.Profile.genitivePoints,
					)}
				</Text>

				<Text style={addTextColor(styles.levelInfo, pickTextColor(theme.primary))}>
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
					<Text style={addTextColor(styles.levelInfo, pickTextColor(theme.primary))}>
						{translations.Profile.toNextLvl}
					</Text>
				</Text>

				<NextLevelBenefits
					titleClassName={addTextColor(styles.nextLevelText, pickTextColor(theme.primary))}
					title={translations.Level.nextLevel}
					color={theme.third}
					textColor={optionalColor}
				/>
			</ScrollView>

			<View style={styles.colorConfigButtonPosition as ViewType}>
				<BoxShadow setting={getShadowOpt(60)}>
					<TouchableOpacity onPress={() => setModalVisible(true)}>
						<View style={addBackgroundColor(styles.colorConfigButton, theme.third)}>
							<Icon name='color-palette-outline' type='ionicon' color={optionalColor} size={30} />
						</View>
					</TouchableOpacity>
				</BoxShadow>
			</View>
		</>
	)
}

export default Profile
