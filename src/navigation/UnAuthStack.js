import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home/Home'

function UnAuthStack() {
  const Stack = createNativeStackNavigator()
  const screens = {
   Home
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

export default UnAuthStack

