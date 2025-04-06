import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

const InputField = (props) => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSend = () => {
    if (message.trim() === '') return;

    const newMessage = {
      _id: Math.random().toString(36).substring(7),
      text: message,
      createdAt: new Date(),
      user: {
        _id: props.user._id,
      },
    };

    props.onSend([newMessage]);
    setMessage('');
    Keyboard.dismiss();
  };

  const handleImageSelect = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      if (image.path) {
        setUploading(true);
        props.onImageSelect && props.onImageSelect(image.path);
      }
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const handleCameraPress = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      if (image.path) {
        setUploading(true);
        props.onImageSelect && props.onImageSelect(image.path);
      }
    } catch (error) {
      console.log('Camera Error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* {uploading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="small" color="#075E54" />
        </View>
      )} */}
      <View style={styles.inputContainer}>
        {/* Attachment button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleImageSelect}
          disabled={uploading}
        >
          <Ionicons name="image" size={24} color="#075E54" />
        </TouchableOpacity>

        {/* Camera button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleCameraPress}
          disabled={uploading}
        >
          <Ionicons name="camera" size={24} color="#075E54" />
        </TouchableOpacity>

        {/* Text input */}
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          onSubmitEditing={handleSend}
          editable={!uploading}
        />

        {/* Send button or microphone */}
        {message.trim() ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={uploading}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Mic pressed')}
            disabled={uploading}
          >
            <Ionicons name="mic" size={24} color="#075E54" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  progressContainer: {
    paddingVertical: 5,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  iconButton: {
    padding: 5,
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 10,
    maxHeight: 100,
    marginLeft: 5,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
});

export default InputField;