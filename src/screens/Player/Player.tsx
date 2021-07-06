import React from 'react'
import { View } from 'react-native'
import { ViewType } from '../../types/styles'
import { NavigationScreenType } from '../../types/navigation'
import { useThemeContext } from '../../utils/context/ThemeContext'
import StatusBar from '../../components/UI/StatusBar/StatusBar'
import PlayerModals from './PlayerModals/PlayerModals'
import PlayerFooter from './PlayerFooter/PlayerFooter'
import PlayerVideo from './PlayerVideo/PlayerVideo'
import { PlayerContextProvider } from './PlayerContext'
import Wavy from '../../components/Wavy/Wavy'
import { addBackgroundColor } from '../../utils/helpers'
import styles from './Player.scss'

type Props = {
	navigation: NavigationScreenType
}

const Player = ({ navigation }: Props) => {
	const themeContext = useThemeContext()
	const { secondary, primary } = themeContext.useSubscribe((s) => s)

	return (
		<View style={addBackgroundColor(styles.container, primary)}>
			<StatusBar bgColor={secondary} />
			<View style={styles.header as ViewType}>
				<Wavy position='footer' />
			</View>

			<PlayerContextProvider navigation={navigation}>
				<PlayerModals />
				<PlayerVideo />
				<PlayerFooter />
			</PlayerContextProvider>
		</View>
	)
}

export default Player
