import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Clipboard,
} from 'react-native';
import {GiftedChat, Bubble, Send, Time} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import styles from './Style';
import InputField from './InputField';
import storage from '@react-native-firebase/storage';
import ChatHeader from './ChatHeader';
import SoundPlayer from 'react-native-sound-player';
import Slider from '@react-native-community/slider';
import Lightbox from 'react-native-lightbox-v2';

const Chat = ({route, navigation}) => {
  const {userId, userName, userAvatar} = route.params;
  const currentUser = auth().currentUser;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const textInputRef = useRef(null);

  const senderUID = currentUser.uid;
  const receiverUID = userId;
  const senderChatRef = database().ref(`chatRooms/${senderUID}_${receiverUID}`);
  const receiverChatRef = database().ref(
    `chatRooms/${receiverUID}_${senderUID}`,
  );

  const handleImageSelect = async imagePath => {
    try {
      await uploadImage(imagePath);
    } catch (error) {
      console.error('Error in handleImageSelect:', error);
    }
  };

  const uploadImage = async imagePath => {
    try {
      const timestamp = Date.now();
      const fileName = `image_${timestamp}.jpg`;
      const reference = storage().ref(
        `chat_images/${senderUID}_${receiverUID}/${fileName}`,
      );
      const task = reference.putFile(imagePath);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      await task;
      const downloadUrl = await reference.getDownloadURL();
      await sendImageMessage(downloadUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  const sendImageMessage = async imageUrl => {
    const messageKey = senderChatRef.push().key;
    const timestamp = Date.now();

    const msgData = {
      imageUrl: imageUrl,
      timestamp: timestamp,
      senderUID: senderUID,
      text: '📷 Photo',
    };

    await senderChatRef.child(messageKey).set(msgData);
    await receiverChatRef.child(messageKey).set(msgData);
  };

  useEffect(() => {
    const handleSnapshot = snapshot => {
      const data = snapshot.val();
      if (data) {
        const receivedMessages = Object.keys(data)
          .map(key => {
            const msg = data[key];
            return {
              _id: key,
              text: msg.text,
              image: msg.imageUrl,
              createdAt: new Date(msg.timestamp),
              voiceMessage: msg?.voiceMessage || null,
              duration: msg?.duration || null,
              user: {
                _id: msg.senderUID,
                name: msg.senderUID === senderUID ? 'You' : userName,
                avatar: userAvatar,
              },
              ...(msg?.imageUrl && {
                image: msg.imageUrl,
                text: msg.text || '📷 Photo',
              }),
            };
          })
          .sort((a, b) => b.createdAt - a.createdAt);
        setMessages(receivedMessages);
      }
      setLoading(false);
    };

    const checkChatPath = async () => {
      const snapshot1 = await database()
        .ref(`chatRooms/${senderUID}_${receiverUID}`)
        .once('value');

      if (snapshot1.exists()) {
        senderChatRef.on('value', handleSnapshot);
      } else {
        setLoading(false);
      }
    };

    checkChatPath();

    return () => {
      senderChatRef.off('value', handleSnapshot);
      database()
        .ref(`chatRooms/${senderUID}_${receiverUID}`)
        .off('value', handleSnapshot);
    };
  }, [senderUID, receiverUID, userName, userAvatar]);

  const sendMessageToDatabase = async newMessages => {
    const message = newMessages[0];
    const msgData = {
      text: message.text,
      timestamp: Date.now(),
      senderUID: senderUID,
      ...(message.voiceMessage && {
        voiceMessage: message.voiceMessage,
        duration: message.duration,
      }),
    };

    const messageKey = senderChatRef.push().key;
    await senderChatRef.child(messageKey).set(msgData);
    await receiverChatRef.child(messageKey).set(msgData);
  };

  const onSend = (newMessages = []) => {
    if (newMessages.length > 0) {
      const message = newMessages[0];
      sendMessageToDatabase(newMessages);
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, message),
      );
    } else {
      console.error('Invalid message data');
    }
  };
  const renderBubble = props => {
    return (
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
        renderMessageImage={props => {
          const imageUri =
            props.currentMessage.image || props.currentMessage.imageUrl;
          return (
            <Lightbox
              renderHeader={close => (
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 10000,
                    top: Platform.OS === 'ios' ? insets.top : 20,
                    left: 0,
                  }}>
                  <TouchableOpacity onPress={close} style={styles.headerIcon}>
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              springConfig={{overshootClamping: true}}>
              <Image
                source={{uri: imageUri}}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 8,
                  backgroundColor: '#f0f0f0',
                }}
                resizeMode="cover"
                onError={e =>
                  console.log('Image loading error:', e.nativeEvent.error)
                }
              />
            </Lightbox>
          );
        }}
        renderCustomView={props => {
          if (props.currentMessage.voiceMessage) {
            return (
              <VoiceMessagePlayer
                uri={props.currentMessage.voiceMessage}
                duration={props.currentMessage.duration}
                isCurrentUser={props.currentMessage.user._id === senderUID}
              />
            );
          }
          return null;
        }}
      />
    );
  };

  const renderTime = props => (
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

  const renderInputToolbar = props => (
    <InputField
      {...props}
      onImageSelect={handleImageSelect}
      onCameraPress={handleImageSelect}
    />
  );

  const renderSend = props => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={20} color="white" />
      </View>
    </Send>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }

  // const onLongPress = (context, message) => {
  //   console.log('asdasd');
  //   // console.log(context, message);

  //   return;

  //   const options = ['Copy Text', 'Cancel'];
  //   const cancelButtonIndex = options.length - 1;

  //   context.actionSheet().showActionSheetWithOptions(
  //     {
  //       options,
  //       cancelButtonIndex,
  //     },
  //     buttonIndex => {
  //       if (buttonIndex === 0) {
  //         Clipboard.setString(message.text);
  //       }
  //     },
  //   );
  // };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{_id: senderUID}}
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
      // onLongPress={onLongPress}
    />
  );
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
          onSend={onSend}
          user={{_id: senderUID}}
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
          // onLongPress={onLongPress}
        />
        {Platform.OS === 'android' && (
          <KeyboardAvoidingView
            keyboardShouldPersistTaps="handled"
            behavior="padding"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const VoiceMessagePlayer = ({uri, duration, isCurrentUser}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (isPlaying) stopPlayback();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const startPlayback = async () => {
    try {
      SoundPlayer.playUrl(uri);
      setIsPlaying(true);

      SoundPlayer.onFinishedPlaying(success => {
        if (success) stopPlayback();
      });

      intervalRef.current = setInterval(async () => {
        try {
          const info = await SoundPlayer.getInfo();
          setPosition(info.currentTime);
          setDurationSec(info.duration);
        } catch (e) {
          clearInterval(intervalRef.current);
        }
      }, 500);
    } catch (error) {
      console.log('Playback error:', error);
      setIsPlaying(false);
    }
  };

  const stopPlayback = () => {
    try {
      SoundPlayer.stop();
      setIsPlaying(false);
      setPosition(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } catch (error) {
      console.log('Stop playback error:', error);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={voiceMessageStyles.container}>
      <TouchableOpacity
        onPress={isPlaying ? stopPlayback : startPlayback}
        style={voiceMessageStyles.playButton}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color={isCurrentUser ? 'blue' : '#075E54'}
        />
      </TouchableOpacity>

      <Slider
        style={voiceMessageStyles.slider}
        value={position}
        minimumValue={0}
        maximumValue={durationSec || 1}
        minimumTrackTintColor={isCurrentUser ? 'blue' : '#075E54'}
        maximumTrackTintColor={isCurrentUser ? 'blue' : 'rgba(0,0,0,0.2)'}
        thumbTintColor={isCurrentUser ? 'blue' : '#075E54'}
        disabled={true}
      />

      <Text
        style={[
          voiceMessageStyles.duration,
          {color: isCurrentUser ? 'blue' : '#075E54'},
        ]}>
        {duration || formatTime(durationSec)}
      </Text>
    </View>
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
export default Chat;
