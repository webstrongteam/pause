import { NavigationScreenProp, NavigationRoute } from 'react-navigation'
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types'

export type NavigationScreenType = NavigationScreenProp<NavigationRoute>
export type NavigationReplaceType = StackNavigationProp<NavigationRoute>
