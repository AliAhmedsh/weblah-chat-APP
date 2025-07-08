import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './Style';
const ChatHeader = ({ chatName, navigation, status }) => {
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
          <Text style={styles.headerTitle} numberOfLines={1}>{chatName}</Text>
          {status && <Text style={styles.headerSubtitle}>{status}</Text>}
        </View>
        {/* <View style={styles.headerIcons}>
          <Ionicons name="videocam" size={24} color="white" style={styles.headerIcon} />
          <Ionicons name="call" size={20} color="white" style={styles.headerIcon} />
          <Ionicons name="ellipsis-vertical" size={20} color="white" style={styles.headerIcon} />
        </View> */}
      </View>
    );
  };

export default ChatHeader