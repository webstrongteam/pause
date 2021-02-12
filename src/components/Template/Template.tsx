import React, { PropsWithChildren } from 'react'
import { StatusBar, View } from 'react-native'
import styles from './Template.styles'
import Spinner from '../Spinner/Spinner'
import { useSettingsContext } from '../../utils/context/SettingsContext'

type Props = {
	children: PropsWithChildren<{}>
}

const Template = ({ children }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const settings = useSubscribe((s) => s.settings)

	if (!settings) {
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
