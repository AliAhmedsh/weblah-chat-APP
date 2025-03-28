import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Chat = ({ route, navigation }) => {
  const { chatName } = route.params;
  const [messages, setMessages] = useState([]);

  // Set header options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{chatName}</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="videocam" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#075E54',
      },
      headerTintColor: 'white',
    });
  }, [navigation, chatName]);

  // Load initial messages
  useLayoutEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hey there!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
      },
      {
        _id: 2,
        text: 'Hello! How are you?',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'You',
          avatar: 'https://i.pravatar.cc/150?img=2',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#DCF8C6',
          },
          left: {
            backgroundColor: 'white',
          },
        }}
        textStyle={{
          right: {
            color: 'black',
          },
          left: {
            color: 'black',
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#075E54" />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <View style={styles.inputToolbarContainer}>
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="attach" size={24} color="#075E54" />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={props.text}
            onChangeText={props.onTextChanged}
            multiline
          />
        </View>
        {props.text.trim().length > 0 && (
          <TouchableOpacity onPress={() => props.onSend({ text: props.text.trim() }, true)}>
            <Ionicons name="send" size={24} color="#075E54" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1, // This should match your user ID
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={() => (
          <Ionicons name="chevron-down-circle" size={24} color="#075E54" />
        )}
        keyboardShouldPersistTaps="never"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'white',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  headerIcon: {
    marginLeft: 20,
  },
  inputToolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachmentButton: {
    padding: 8,
    marginRight: 5,
  },
  inputContainer: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
});

export default Chat;