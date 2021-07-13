import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { useNetInfo } from '@react-native-community/netinfo'
import { Icon } from 'react-native-elements'
import * as FileSystem from 'expo-file-system'
import { DownloadProgressData } from 'expo-file-system/src/FileSystem.types'
import { usePlayerContext } from '../../PlayerContext'
import { usePauseContext } from '../../../../utils/context/PauseContext'
import { useThemeContext } from '../../../../utils/context/ThemeContext'
import { useSettingsContext } from '../../../../utils/context/SettingsContext'
import { sentryError } from '../../../../utils/sentryEvent'
import config from '../../../../config/config'
import ProgressBar from '../../../../components/ProgressBar/ProgressBar'
import Spinner from '../../../../components/Spinner/Spinner'
import { addTextColor, pickTextColor } from '../../../../utils/helpers'
import { ViewType } from '../../../../types/styles'
import useAsyncEffect from '../../../../utils/hooks/useAsyncEffect'
import styles from './DownloadVideoScreen.scss'

type Props = {
	playerHeight: number
	playerWidth: number
}

const DownloadVideoScreen = ({ playerHeight, playerWidth }: Props) => {
	const netInfo = useNetInfo()

	const playerContext = usePlayerContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()
	const settingsContext = useSettingsContext()

	const { primary, secondary } = themeContext.useSubscribe((s) => s)
	const videoId = pauseContext.useSubscribe((s) => s.exercise?.videoId)
	const translations = settingsContext.useSubscribe((s) => s.translations)

	const [progress, setProgress] = useState<number | undefined>()
	const [showInternetDisconnectedInfo, setShowInternetDisconnectedInfo] = useState<boolean | null>(
		false,
	)

	const fileUrl = `${config.CLIPS_URL}${videoId}.mp4`
	const fileUri = `${FileSystem.documentDirectory}/clips/${videoId}.mp4`

	const setDownloadProgress = (downloadProgress: DownloadProgressData) => {
		const videoDownloadProgress = +(
			downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
		).toFixed(3)

		setProgress(videoDownloadProgress)
	}

	const downloadResumable = FileSystem.createDownloadResumable(
		fileUrl,
		fileUri,
		{},
		setDownloadProgress,
	)

	const checkVideoOnFileSystem = async () => {
		try {
			const result = await FileSystem.getInfoAsync(fileUri)
			if (!result.exists) {
				setShowInternetDisconnectedInfo(!netInfo.isConnected)
				if (!netInfo.isConnected) return

				await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}/clips/`, {
					intermediates: true,
				})
				const file = await downloadResumable.downloadAsync()
				playerContext.setPlayer({ videoUri: file?.uri })
			} else {
				playerContext.setPlayer({ videoUri: result.uri })
			}
		} catch (err) {
			sentryError(err)
		}
	}

	useAsyncEffect(async () => {
		await checkVideoOnFileSystem()
	}, [netInfo.isConnected])

	if (showInternetDisconnectedInfo) {
		return (
			<View style={{ width: playerWidth, height: playerHeight }}>
				<View
					style={[
						styles.internetDisconnectedInfo as ViewType,
						{ width: playerWidth, height: playerHeight },
					]}
				>
					<Icon color={pickTextColor(secondary)} size={80} name='signal-wifi-off' type='material' />
					<Text style={addTextColor(styles.internetDisconnectedText, pickTextColor(secondary))}>
						{translations.Player.internetDisconnected}
					</Text>
				</View>
			</View>
		)
	}

	if (progress === undefined) {
		return (
			<View style={{ width: playerWidth, height: playerHeight }}>
				<View
					style={[
						styles.downloadProgress as ViewStyle,
						{ width: playerWidth, height: playerHeight },
					]}
				>
					<Spinner bgColor='#fff' color={primary} size={48} />
				</View>
			</View>
		)
	}

	return (
		<View style={{ width: playerWidth, height: playerHeight }}>
			<View
				style={[styles.downloadProgress as ViewStyle, { width: playerWidth, height: playerHeight }]}
			>
				<Text style={addTextColor({}, pickTextColor(secondary))}>
					{translations.Player.loading}
				</Text>
				<ProgressBar
					maxValue={1}
					currentValue={progress}
					barColor='#000'
					className={[styles.progressBar as ViewStyle, { width: playerWidth / 2 }]}
				/>
			</View>
			<View
				style={[styles.downloadScreen as ViewStyle, { width: playerWidth, height: playerHeight }]}
			/>
		</View>
	)
}

export default DownloadVideoScreen
