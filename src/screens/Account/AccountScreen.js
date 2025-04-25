import React from 'react';
import {Alert, Pressable, StatusBar, Text, View} from 'react-native';
import AccountHeader from './AccountHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './Style';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {clearState} from '../../redux/slices/userSlice';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ItemSetting = ({name, action, icon, iconSize, description}) => {
  return (
    <Pressable
      style={{
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
      }}
      onPress={action}>
      <View
        style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
        <Ionicons name={icon} size={iconSize || 25} color="black" />
      </View>
      <View style={{flex: 0.85}}>
        <Text style={{fontSize: 16}}>{name}</Text>
      </View>
    </Pressable>
  );
};

export default function AccountScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {user} = useSelector(state => state?.userReducer);
  const dispatch = useDispatch();

  console.log(user);

  const actions = [
    {
      name: 'Delete account',
      icon: 'trash-outline',
      action: () => handleDeleteAccount(),
    },
  ];

  const handleDeleteAccount = () => {
    Alert.alert(
      'Weblah',
      'Are you sure you want to delete account permanently?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteUserAccount();
            dispatch(clearState());
            navigation.replace('Login');
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const deleteUserAccount = async () => {
    try {
      if (user && user.email === user?.email) {
        const userDoc = await firestore()
          .collection('users')
          .where('email', '==', user.email)
          .get();

        if (!userDoc.empty) {
          userDoc.forEach(async doc => {
            await firestore().collection('users').doc(doc.id).delete();
          });
        } else {
          console.log('No matching user document found in Firestore');
        }

        const checkInsDocs = await firestore()
          .collection('checkIns')
          .where('uid', '==', user.uid)
          .get();

        if (!checkInsDocs.empty) {
          checkInsDocs.forEach(async doc => {
            await firestore().collection('checkIns').doc(doc.id).delete();
          });
        } else {
          console.log('No matching checkIns document found in Firestore');
        }

        const listenersDocs = await firestore()
          .collection('Listeners')
          .where('uid', '==', user.uid)
          .get();

        if (!listenersDocs.empty) {
          listenersDocs.forEach(async doc => {
            await firestore().collection('Listeners').doc(doc.id).delete();
          });
        } else {
          console.log('No matching Listeners document found in Firestore');
        }

        const {currentUser} = auth();

        await currentUser.delete();
      } else {
        console.log(
          'No user is currently signed in or the emails do not match',
        );
      }
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <View style={styles.container}>
        <AccountHeader navigation={navigation} />
        <View style={{marginTop: 10}}>
          {actions.map(item => (
            <ItemSetting
              name={item?.name}
              icon={item?.icon}
              action={item?.action}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
