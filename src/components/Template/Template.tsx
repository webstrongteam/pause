import React, { ReactNode, useState } from 'react'
import { Platform, StatusBar, View } from 'react-native'
import Spinner from '../Spinner/Spinner'

type Props = {
	children: ReactNode
}

const Template = ({ children }: Props) => {
	const [loading] = useState<boolean>(false)

	// load settings to context

	return (
		<View style={{ flex: 1 }}>
			{loading ? (
				<Spinner size={64} />
			) : (
				<>
					<View
						style={{
							height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
						}}
					>
						<StatusBar backgroundColor='rgba(0, 0, 0, 0.2)' translucent />
					</View>
					{children}
				</>
			)}
		</View>
	)
}

export default Template
