import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import UnAuthStack from './UnAuthStack'
import AuthStack from './AuthStack'

export default function AppNavigation() {
    const user = {uid: '123'}
  return (
    <NavigationContainer
    >
      {user?.uid ? <UnAuthStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

