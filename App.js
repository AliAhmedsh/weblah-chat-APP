import { View, Text, LogBox, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthStack } from './src/navigation/AuthStack'
import AppNavigation from './src/navigation'
import { createDummyUsers } from './src/FirebaseFunctions/dummyUserFunc'

export default function App() {
  // useEffect(() => {
  //   createDummyUsers()
  // }, [])
  LogBox.ignoreAllLogs(true)
  const queryClient = new QueryClient()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AppNavigation />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

