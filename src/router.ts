import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
// Screens
import Home from './screens/Home/Home'
import Pause from './screens/Pause/Pause'
import Profile from './screens/Profile/Profile'
import Settings from './screens/Settings/Settings'
import Player from './screens/Player/Player'

const MainNavigator = createStackNavigator(
	{
		Home: { screen: Home },
		PauseScreen: { screen: Pause },
		Profile: { screen: Profile },
		Settings: { screen: Settings },
		Player: { screen: Player },
	},
	{
		initialRouteName: 'Home',
		headerMode: 'none',
	},
)

const router = createAppContainer(MainNavigator)

export default router
