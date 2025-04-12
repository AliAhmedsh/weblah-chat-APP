import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Slider from '@react-native-community/slider';
import SoundPlayer from 'react-native-sound-player';
import Responsive from '../../libs/responsive';
import storage from '@react-native-firebase/storage';

const { getHeight, getWidth, AppFonts } = Responsive;

const audioRecorderPlayer = new AudioRecorderPlayer();

const InputField = (props) => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [inputHeight, setInputHeight] = useState(getHeight(4));
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [recordPath, setRecordPath] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [showVoiceMessageUI, setShowVoiceMessageUI] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const playbackInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
      if (isPlaying) {
        stopPlaying();
      }
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    };
  }, [isRecording, isPlaying]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const startRecording = async () => {
    try {
      setShowVoiceMessageUI(true);
      startPulseAnimation();
      setIsRecording(true);
      const result = await audioRecorderPlayer.startRecorder();
      setRecordPath(result);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        return;
      });
    } catch (error) {
      console.log('Recording error:', error);
      setIsRecording(false);
      setShowVoiceMessageUI(false);
      stopPulseAnimation();
    }
  };

  const stopRecording = async () => {
    try {
      stopPulseAnimation();
      setIsRecording(false);
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordPath(result);
    } catch (error) {
      console.log('Stop recording error:', error);
    }
  };

  const cancelRecording = async () => {
    await stopRecording();
    setShowVoiceMessageUI(false);
    setRecordPath('');
  };

  const sendRecording = async () => {
    if (!recordPath) return;
    
    setUploading(true);
    
    try {
      // Upload to Firebase Storage
      const timestamp = Date.now();
      const fileName = `voice_message_${timestamp}.mp3`;
      const reference = storage().ref(`voice_messages/${props.user._id}_${timestamp}/${fileName}`);
      const task = reference.putFile(recordPath);
      
      await task;
      const downloadUrl = await reference.getDownloadURL();
      
      // Send message with voice URL
      const newMessage = {
        _id: Math.random().toString(36).substring(7),
        text: '🎤 Voice message',
        createdAt: new Date(),
        user: {
          _id: props.user._id,
        },
        voiceMessage: downloadUrl,
        duration: recordTime,
      };
console.log(newMessage, 'neewwwwwwwwww')
      props.onSend([newMessage]);
    } catch (error) {
      console.log('Voice message upload error:', error);
    } finally {
      setUploading(false);
      setShowVoiceMessageUI(false);
      setRecordPath('');
    }
  };

  const playRecording = async () => {
    try {
      SoundPlayer.playUrl(recordPath);
      setIsPlaying(true);
      
      SoundPlayer.onFinishedPlaying((success) => {
        if (success) stopPlaying();
      });
      
      // Update progress
      playbackInterval.current = setInterval(async () => {
        try {
          const info = await SoundPlayer.getInfo();
          setCurrentPositionSec(info.currentTime);
          setCurrentDurationSec(info.duration);
        } catch (e) {
          clearInterval(playbackInterval.current);
        }
      }, 500);
      
    } catch (error) {
      console.log('Playback error:', error);
      setIsPlaying(false);
    }
  };

  const stopPlaying = () => {
    try {
      SoundPlayer.stop();
      setIsPlaying(false);
      setCurrentPositionSec(0);
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    } catch (error) {
      console.log('Stop playback error:', error);
    }
  };

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

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      {showVoiceMessageUI && (
        <View style={styles.voiceMessageContainer}>
          <View style={styles.voiceMessageControls}>
            <TouchableOpacity onPress={cancelRecording}>
              <Ionicons name="trash" size={getHeight(3)} color="red" />
            </TouchableOpacity>
            
            <View style={styles.recordingInfo}>
              {isRecording ? (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Ionicons name="mic" size={getHeight(3)} color="red" />
                </Animated.View>
              ) : (
                <TouchableOpacity 
                  onPress={playRecording} 
                  disabled={isPlaying || !recordPath}
                >
                  <Ionicons 
                    name={isPlaying ? "pause" : "play"} 
                    size={getHeight(3)} 
                    color={recordPath ? "#075E54" : "#cccccc"} 
                  />
                </TouchableOpacity>
              )}
              
              <Text style={styles.recordTime}>{recordTime.substring(0, 5)}</Text>
              
              {!isRecording && recordPath && (
                <Slider
                  style={styles.slider}
                  value={currentPositionSec}
                  minimumValue={0}
                  maximumValue={currentDurationSec || 1}
                  minimumTrackTintColor="#075E54"
                  maximumTrackTintColor="#cccccc"
                  thumbTintColor="#075E54"
                  disabled={true}
                />
              )}
            </View>
            
            {isRecording ? (
              <TouchableOpacity 
                onPress={stopRecording}
                style={styles.stopButton}
              >
                <Ionicons name="square" size={getHeight(2.5)} color="white" />
              </TouchableOpacity>
            ) : (
              recordPath && (
                <TouchableOpacity 
                  onPress={sendRecording} 
                  disabled={uploading}
                  style={styles.sendButton}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="send" size={getHeight(2.5)} color="white" />
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      )}

      {!showVoiceMessageUI && (
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleImageSelect}
            disabled={uploading}
          >
            <Ionicons 
              name="image" 
              size={getHeight(2.8)} 
              color={uploading ? "#cccccc" : "#075E54"} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleCameraPress}
            disabled={uploading}
          >
            <Ionicons 
              name="camera" 
              size={getHeight(2.8)} 
              color={uploading ? "#cccccc" : "#075E54"} 
            />
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
              onPress={handleMicPress}
              disabled={uploading}
            >
              <Ionicons 
                name={isRecording ? "mic" : "mic-outline"} 
                size={getHeight(2.8)} 
                color={isRecording ? "red" : "#075E54"} 
              />
            </TouchableOpacity>
          )}
        </View>
      )}
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
  stopButton: {
    width: getHeight(4),
    height: getHeight(4),
    borderRadius: getHeight(2),
    backgroundColor: 'red',
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
  voiceMessageContainer: {
    backgroundColor: 'white',
    borderRadius: getHeight(2),
    padding: getHeight(1.5),
  },
  voiceMessageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: getWidth(2),
  },
  recordTime: {
    fontSize: AppFonts.t3,
    color: '#667781',
    marginLeft: getWidth(2),
    minWidth: getWidth(10),
  },
  slider: {
    flex: 1,
    height: getHeight(2),
    marginHorizontal: getWidth(1),
  },
});

export default InputField;