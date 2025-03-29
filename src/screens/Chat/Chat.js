import React, { useState, useCallback, useLayoutEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  Text, 
  TextInput,
  SafeAreaView,
  Platform
} from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Custom Header Component
const ChatHeader = ({ chatName, navigation }) => {
  return (
    <SafeAreaView style={styles.headerSafeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{chatName}</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        
        <View style={styles.headerRightContainer}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="videocam" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Chat = ({ route, navigation }) => {
  const { chatName } = route.params;
  const [messages, setMessages] = useState([
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
            marginBottom: 5,
            marginRight: 8,
          },
          left: {
            backgroundColor: 'white',
            marginBottom: 5,
            marginLeft: 8,
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
        timeTextStyle={{
          right: {
            color: '#555',
          },
          left: {
            color: '#555',
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send 
        {...props} 
        containerStyle={styles.sendContainer}
        alwaysShowSend={true}
      >
        <View style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
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
        <TouchableOpacity style={styles.emojiButton}>
          <Ionicons name="happy-outline" size={24} color="#075E54" />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={props.text}
            onChangeText={text => {
              props.onTextChanged(text);
            }}
            multiline
          />
        </View>
        {renderSend(props)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <ChatHeader chatName={chatName} navigation={navigation} />
      
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        alwaysShowSend={true}
        scrollToBottom={true}
        scrollToBottomComponent={() => (
          <View style={styles.scrollToBottom}>
            <Ionicons name="chevron-down-circle" size={24} color="#075E54" />
          </View>
        )}
        keyboardShouldPersistTaps="never"
        minInputToolbarHeight={70}
        bottomOffset={Platform.OS === 'ios' ? 0 : 20}
        listViewProps={{
          style: {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header Styles
  headerSafeArea: {
    backgroundColor: '#075E54',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#075E54',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
  },
  // Input Toolbar Styles
  inputToolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: Platform.OS === 'ios' ? 5 : 0,
  },
  attachmentButton: {
    padding: 8,
    marginRight: 5,
  },
  emojiButton: {
    padding: 8,
    marginRight: 5,
  },
  inputContainer: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingTop: Platform.OS === 'ios' ? 0 : 4,
    paddingBottom: Platform.OS === 'ios' ? 0 : 4,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollToBottom: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default Chat;