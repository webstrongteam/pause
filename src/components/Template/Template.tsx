import React, { PropsWithChildren } from 'react'
import { StatusBar, View } from 'react-native'
import { useThemeContext } from '../../utils/context/ThemeContext'
import Spinner from '../Spinner/Spinner'
import { ViewType } from '../../types/styles'
import styles from './Template.scss'

const Template = ({ children }: PropsWithChildren<{}>) => {
	const { useSubscribe } = useThemeContext()
	const primaryColor = useSubscribe((t) => t.primary)

	// If primary color is not '', it means that the settings and themes have been loaded.
	if (primaryColor === '') {
		return <Spinner size={64} />
	}

	return (
		<View style={styles.container as ViewType}>
			<StatusBar barStyle='dark-content' backgroundColor='rgba(0, 0, 0, 0.2)' translucent />
			{children}
		</View>
	)
}

export default Template
