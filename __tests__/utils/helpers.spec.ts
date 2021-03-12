import { defaultSettings, pauseExample } from '../fixtures'
import { getNextLevelBenefits, getPointsToLevelUp, getRandomPause } from '../../src/utils/helpers'
import { baseLevelPoints, progressMultiplier } from '../../src/utils/consts'

describe('Helpers fn', () => {
	it('should get pause', () => {
		const pause = getRandomPause(pauseExample, defaultSettings)
		expect(pause).toMatchObject(pauseExample)
	})
	it('should get points to level up', () => {
		const pointsToLevelUp = getPointsToLevelUp(1)
		expect(pointsToLevelUp).toEqual(baseLevelPoints + progressMultiplier)
	})
	it('should get next level benefits', () => {
		const matchObject = {
			music: {},
			exercises: {},
			themes: {},
		}

		const nextLevelBenefits = getNextLevelBenefits(1)
		expect(nextLevelBenefits).toMatchObject(matchObject)
		const nextLevelBenefitsTo100Level = getNextLevelBenefits(100)
		expect(nextLevelBenefitsTo100Level).toMatchObject(matchObject)
	})
})
