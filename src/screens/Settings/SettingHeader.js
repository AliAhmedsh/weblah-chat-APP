import {View, Text} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './Style';
import {useNavigation} from '@react-navigation/native';
const SettingHeader = ({}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="white"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />
      <View style={styles.headerInfoContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Setting
        </Text>
      </View>
    </View>
  );
};

export default SettingHeader;
