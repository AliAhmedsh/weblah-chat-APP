import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login/Login'

function AuthStack() {
  const Stack = createNativeStackNavigator()
  const screens = {
   Login
  }

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
        {Object.entries(screens).map(([name, component]) => (
          <Stack.Screen
            key={name}
            name={name}
            component={component}
          />
        ))}
      </Stack.Navigator>
    </>
  )
}

export default AuthStack

