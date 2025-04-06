import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { 
  View, 
  StatusBar, 
  ActivityIndicator, 
  KeyboardAvoidingView,
  Platform,
  Text,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Time } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
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
      <View style={styles.headerIcons}>
        <Ionicons name="videocam" size={24} color="white" style={styles.headerIcon} />
        <Ionicons name="call" size={20} color="white" style={styles.headerIcon} />
        <Ionicons name="ellipsis-vertical" size={20} color="white" style={styles.headerIcon} />
      </View>
    </View>
  );
};

const Chat = ({ route, navigation }) => {
  const { userId, userName, userAvatar } = route.params;
  const currentUser = auth().currentUser;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const senderUID = currentUser.uid;
  const receiverUID = userId;

  const senderChatRef = database().ref(`chatRooms/${senderUID}_${receiverUID}`);
  const receiverChatRef = database().ref(`chatRooms/${receiverUID}_${senderUID}`);

  // useLayoutEffect(() => {
  //   navigation.setOptions({ headerShown: false });
  // }, [navigation]);

  useEffect(() => {
    const handleSnapshot = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const receivedMessages = Object.keys(data)
          .map((key) => {
            const msg = data[key];
            return {
              _id: key,
              text: msg.text,
              createdAt: new Date(msg.timestamp),
              user: { 
                _id: msg.senderUID,
                name: msg.senderUID === senderUID ? 'You' : userName,
                avatar: userAvatar 
              },
            };
          })
          .sort((a, b) => b.createdAt - a.createdAt);
        setMessages(receivedMessages);
      }
      setLoading(false);
    };
  
    const checkChatPath = async () => {
      const snapshot1 = await database().ref(`chatRooms/${senderUID}_${receiverUID}`).once('value');
      
      if (snapshot1.exists()) {
        senderChatRef.on('value', handleSnapshot);
      } else {
        setLoading(false);
      }
    };
  
    checkChatPath();
  
    return () => {
      senderChatRef.off('value', handleSnapshot);
      database().ref(`chatRooms/${senderUID}_${receiverUID}`).off('value', handleSnapshot);
    };
  }, [senderUID, receiverUID, userName, userAvatar]);

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];

    const msgData = {
      text: message.text,
      timestamp: Date.now(),
      senderUID: senderUID,
    };

    const messageKey = senderChatRef.push().key;
    await senderChatRef.child(messageKey).set(msgData);
    await receiverChatRef.child(messageKey).set(msgData);
  }, []);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#DCF8C6',
          marginBottom: 8,
          marginRight: 8,
          borderRadius: 8,
          borderTopRightRadius: props.position === 'right' ? 0 : 8,
        },
        left: {
          backgroundColor: 'white',
          marginBottom: 8,
          marginLeft: 8,
          borderRadius: 8,
          borderTopLeftRadius: props.position === 'left' ? 0 : 8,
        },
      }}
      textStyle={{
        right: {
          color: 'black',
          fontSize: 16,
        },
        left: {
          color: 'black',
          fontSize: 16,
        },
      }}
      timeTextStyle={{
        right: {
          color: '#667781',
          fontSize: 12,
        },
        left: {
          color: '#667781',
          fontSize: 12,
        },
      }}
    />
  );

  const renderTime = (props) => (
    <Time
      {...props}
      timeTextStyle={{
        left: {
          color: '#667781',
          fontSize: 12,
        },
        right: {
          color: '#667781',
          fontSize: 12,
        },
      }}
    />
  );

  const renderSend = (props) => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={20} color="white" />
      </View>
    </Send>
  );
  
  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarContainer}
      primaryStyle={styles.inputPrimary}
      accessoryStyle={styles.accessoryStyle}
    />
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <View style={styles.container}>
        <ChatHeader 
          chatName={userName} 
          navigation={navigation} 
          status="online" 
        />
        
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{ _id: senderUID }}
          renderBubble={renderBubble}
          renderTime={renderTime}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          alwaysShowSend
          scrollToBottom
          scrollToBottomComponent={() => (
            <View style={styles.scrollToBottom}>
              <Ionicons name="chevron-down-circle" size={24} color="#075E54" />
            </View>
          )}
          textInputStyle={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          renderAvatarOnTop
          minInputToolbarHeight={60}
          listViewProps={{
            style: styles.chatList,
          }}
          keyboardShouldPersistTaps="never"
        />
        {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
      </View>
    </SafeAreaView>
  );
};
export default Chat;