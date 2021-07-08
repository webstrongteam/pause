import React from 'react'
import { usePlayerContext } from '../PlayerContext'
import ExerciseInfoModal from '../components/Modals/ExerciseInfoModal/ExerciseInfoModal'
import RatingsModal from '../components/Modals/RatingsModal/RatingsModal'
import LeaveModal from '../components/Modals/LeaveModal/LeaveModal'

const PlayerModals = () => {
	const playerContext = usePlayerContext()

	const player = playerContext.useSubscribe((s) => s)

	if (player.modalType === 'leaveModal') {
		return <LeaveModal />
	}

	if (player.modalType === 'exerciseInfoModal') {
		return <ExerciseInfoModal />
	}

	if (player.modalType === 'ratingsModal') {
		return <RatingsModal />
	}

	return <></>
}

export default PlayerModals
