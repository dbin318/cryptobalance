import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'

import BalanceScreen from './screens/BalanceScreen'
import ApiScreen from './screens/ApiScreen'
import SettingsScreen from './screens/SettingsScreen'
import AboutScreen from './screens/AboutScreen'

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TabNavigator />
    )
  }
}

const TabNavigator = createBottomTabNavigator({
  Balance: BalanceScreen,
  Api: ApiScreen,
  Settings: SettingsScreen,
  About: AboutScreen
}, {
  initialRouteName: 'Balance',
  tabBarOptions: {
    activeTintColor: '#e91e63',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: 'blue',
    },
  },
})
