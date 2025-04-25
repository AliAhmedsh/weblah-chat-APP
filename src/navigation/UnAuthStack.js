import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home/Home';
import Chat from '../screens/Chat/Chat';
import SettingScreen from '../screens/Settings/Setting';
import AccountScreen from '../screens/Account/AccountScreen';

export const UnAuthStack = () => {
  const Stack = createNativeStackNavigator();
  const screens = [
    {
      name: 'Home',
      component: Home,
    },
    {
      name: 'Chat',
      component: Chat,
    },
    {
      name: 'SettingsScreen',
      component: SettingScreen,
    },
    {
      name: 'AccountScreen',
      component: AccountScreen,
    },
  ];

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
          freezeOnBlur: true,
          animation: 'none',
        }}>
        {screens.map(screen => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
          />
        ))}
      </Stack.Navigator>
    </>
  );
};
