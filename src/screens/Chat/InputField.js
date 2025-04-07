import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Responsive from '../../libs/responsive';
const { getHeight, getWidth, AppFonts } = Responsive;

const InputField = (props) => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [inputHeight, setInputHeight] = useState(getHeight(4));

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
  const handleContentSizeChange = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const minHeight = getHeight(4.5);
    const maxHeight = getHeight(7);  
    const newHeight = Math.min(Math.max(minHeight, contentHeight), maxHeight);
    setInputHeight(newHeight);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleImageSelect}
          disabled={uploading}
        >
          <Ionicons name="image" size={getHeight(2.8)} color="#075E54" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleCameraPress}
          disabled={uploading}
        >
          <Ionicons name="camera" size={getHeight(2.8)} color="#075E54" />
        </TouchableOpacity>

        <TextInput
          style={[styles.textInput, { height: inputHeight }]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={2}
          scrollEnabled={true}
          editable={!uploading}
          onContentSizeChange={handleContentSizeChange}
          textAlignVertical="top"
        />


        {uploading ? (
          <View style={styles.uploadIndicator}>
            <ActivityIndicator size="small" color="#075E54" />
          </View>
        ) : message.trim() ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={uploading}
          >
            <Ionicons name="send" size={getHeight(2.4)} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Mic pressed')}
            disabled={uploading}
          >
            <Ionicons name="mic" size={getHeight(2.8)} color="#075E54" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderTopColor: '#e5e5e5',
    paddingVertical: getHeight(1),
    paddingHorizontal: getWidth(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: getHeight(5),
    paddingHorizontal: getWidth(2),
    minHeight: getHeight(5),
  },
  iconButton: {
    paddingHorizontal: getWidth(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: getWidth(8),
    minHeight: getHeight(4),
  },
  textInput: {
    flex: 1,
    fontSize: AppFonts.t3,
    color: 'black',
    marginLeft: getWidth(1.5),
    marginRight: getWidth(1.5),
    paddingVertical: getHeight(1),
    maxHeight: getHeight(14),
    includeFontPadding: false,
    textAlignVertical: 'top',
  },

  sendButton: {
    width: getHeight(4),
    height: getHeight(4),
    borderRadius: getHeight(2),
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: getWidth(1),
  },
  uploadIndicator: {
    width: getHeight(4),
    height: getHeight(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: getWidth(1),
  },
});

export default InputField;