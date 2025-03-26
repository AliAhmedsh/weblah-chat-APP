import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login/Login'
import SignUp from '../screens/SignUp/SignUp'

export const AuthStack = () => {
  const Stack = createNativeStackNavigator()
  const screens = [
    {
      name: 'Login',
      component: Login
    },
    {
      name: 'SignUp',
      component: SignUp
    },
  ]

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
          freezeOnBlur: true,
          animation: 'none',
        }}
      >
        {screens.map((screen) => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
          />
        ))}
      </Stack.Navigator>
    </>
  )
}
