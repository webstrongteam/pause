import React, { PropsWithChildren } from 'react'
import { StatusBar, View } from 'react-native'
import styles from './Template.styles'
import Spinner from '../Spinner/Spinner'
import { useThemeContext } from '../../utils/context/ThemeContext'

type Props = {
	children: PropsWithChildren<{}>
}

const Template = ({ children }: Props) => {
	const { useSubscribe } = useThemeContext()
	const themeRequiredLevel = useSubscribe((s) => s.requiredLevel)

	// If theme required level is not 0, it means that the settings and themes have been loaded.
	if (!themeRequiredLevel) {
		return <Spinner size={64} />
	}

	return (
		<View style={styles.container}>
			<View style={styles.statusBar}>
				<StatusBar barStyle='dark-content' backgroundColor='rgba(0, 0, 0, 0.2)' translucent />
			</View>
			{children}
		</View>
	)
}

export default Template
