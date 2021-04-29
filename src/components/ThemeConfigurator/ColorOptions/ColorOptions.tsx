import React from 'react'
import { View } from 'react-native'
import styles from './ColorOptions.scss'
import RenderColors from '../RenderColors/RenderColors'

//Types
import { ColorType } from '../../../types/theme'
import { ViewType } from '../../../types/styles'

//Contexts
import { useThemeContext } from '../../../utils/context/ThemeContext'

//Helpers and actions
import { addBackgroundColor } from '../../../utils/helpers'

type Props = {
	type: ColorType
}

const ColorOptions = ({ type }: Props) => {
	const { useSubscribe } = useThemeContext()
	const theme = useSubscribe((t) => t)

	return (
		<View style={styles.container as ViewType}>
			<View style={addBackgroundColor(styles.changingColor, theme[type])} />
			<RenderColors type={type} />
		</View>
	)
}

export default ColorOptions
