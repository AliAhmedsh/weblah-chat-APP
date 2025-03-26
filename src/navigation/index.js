import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthStack } from './AuthStack'
import { UnAuthStack } from './UnAuthStack'
import { useSelector } from 'react-redux'

const AppNavigation = () => {
  const { user } = useSelector((state) => state?.userReducer)
  console.log("🚀 ~ AppNavigation ~ user:", user)
  return (
    <NavigationContainer>
      <View style={styles.safeAreaFlex}>
        {user?.uid ? <UnAuthStack /> : <AuthStack />}
      </View>
    </NavigationContainer>
  )
}

export default AppNavigation

const styles = StyleSheet.create({
  safeAreaFlex: {
    flex: 1,
    backgroundColor: 'red'
  },
})