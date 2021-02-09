import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
// Screens
import Home from './screens/Home/Home'
import Profile from './screens/Profile/Profile'

const MainNavigator = createStackNavigator(
	{
		Home: { screen: Home },
		Profile: { screen: Profile },
	},
	{
		initialRouteName: 'Profile',
		headerMode: 'none',
	},
)

const router = createAppContainer(MainNavigator)

export default router
