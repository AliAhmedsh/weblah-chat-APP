import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SettingHeader from './SettingHeader';
import styles from './Style';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ItemSetting = ({name, action, icon, iconSize, description}) => {
  return (
    <Pressable
      style={{
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
      }}
      onPress={action}>
      <View
        style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
        <Ionicons name={icon} size={iconSize || 30} color="black" />
      </View>
      <View style={{flex: 0.85}}>
        <Text style={{fontWeight: 'bold', fontSize: 17}}>{name}</Text>
        <Text style={{fontSize: 12}}>{description}</Text>
      </View>
    </Pressable>
  );
};

const SettingScreen = ({}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const {user} = useSelector(state => state?.userReducer);

  const actions = [
    {
      name: 'Account',
      icon: 'key',
      description: 'Security notifications, change number',
      action: () => navigation.navigate('AccountScreen'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <View style={styles.container}>
        <SettingHeader navigation={navigation} status="online" />
        <View
          style={{
            marginTop: 16,
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}>
          <View
            style={{
              width: 70,
              aspectRatio: 1,
              backgroundColor: 'red',
              borderRadius: 100,
              overflow: 'hidden',
            }}>
            <Image
              source={{uri: user?.avatar}}
              style={{height: '100%', width: '100%'}}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>{user?.name}</Text>
            <Text style={{fontSize: 14}}>Hey there! I am using Weblah</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 40,
            borderTopColor: '#B0BBD2',
            borderTopWidth: 0.5,
            paddingTop: 10,
          }}>
          {actions.map(item => (
            <ItemSetting
              name={item?.name}
              action={item?.action}
              icon={item?.icon}
              description={item?.description}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const voiceMessageStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    width: 200,
  },
  playButton: {
    marginRight: 8,
  },
  slider: {
    flex: 1,
    height: 20,
    marginHorizontal: 8,
  },
  duration: {
    fontSize: 12,
    marginLeft: 8,
  },
});
export default SettingScreen;
