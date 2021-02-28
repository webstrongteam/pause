import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
// Screens
import Home from './screens/Home/Home'
import Profile from './screens/Profile/Profile'
import Settings from './screens/Settings/Settings'

const MainNavigator = createStackNavigator(
	{
		Home: { screen: Home },
		Profile: { screen: Profile },
		Settings: { screen: Settings },
	},
	{
		initialRouteName: 'Home',
		headerMode: 'none',
	},
)

const router = createAppContainer(MainNavigator)

export default router
