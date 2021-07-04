import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { DownloadProgressData } from 'expo-file-system/src/FileSystem.types'
import { usePlayerContext } from '../../PlayerContext'
import { usePauseContext } from '../../../../utils/context/PauseContext'
import { useThemeContext } from '../../../../utils/context/ThemeContext'
import config from '../../../../config/config'
import useAsyncEffect from '../../../../utils/hooks/useAsyncEffect'
import ProgressBar from '../../../../components/ProgressBar/ProgressBar'
import Spinner from '../../../../components/Spinner/Spinner'
import styles from './DownloadVideo.scss'
import { useSettingsContext } from '../../../../utils/context/SettingsContext'

type Props = {
	playerHeight: number
	playerWidth: number
}

const DownloadVideo = ({ playerHeight, playerWidth }: Props) => {
	const playerContext = usePlayerContext()
	const pauseContext = usePauseContext()
	const themeContext = useThemeContext()
	const settingsContext = useSettingsContext()

	const videoId = pauseContext.useSubscribe((s) => s.exercise?.videoId)
	const { primary } = themeContext.useSubscribe((s) => s)
	const translations = settingsContext.useSubscribe((s) => s.translations)

	const [progress, setProgress] = useState<number | undefined>()

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
		const result = await FileSystem.getInfoAsync(fileUri)
		if (!result.exists) {
			await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}/clips/`, {
				intermediates: true,
			})
			const file = await downloadResumable.downloadAsync()
			playerContext.setPlayer({ videoUri: file?.uri })
		} else {
			playerContext.setPlayer({ videoUri: result.uri })
		}
	}

	useAsyncEffect(async () => {
		await checkVideoOnFileSystem()
	}, [])

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
				<Text>{translations.Player.loading}</Text>
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

export default DownloadVideo
