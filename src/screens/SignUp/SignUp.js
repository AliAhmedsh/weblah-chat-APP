import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  Alert,
  Image,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import styles from './Style';
import { useDispatch } from 'react-redux';
import { dispatchUser } from '../../redux/slices/userSlice';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
      });

      setFormData({
        ...formData,
        avatar: {
          uri: image.path,
          name: `avatar_${Date.now()}.jpg`,
          type: image.mime
        }
      });
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to select image');
      }
    }
  };

  const uploadImage = async (uid) => {
    if (!formData.avatar) return null;

    const reference = storage().ref(`users/${uid}/avatar.jpg`);
    const task = reference.putFile(formData.avatar.uri);

    task.on('state_changed', (taskSnapshot) => {
      const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
      setUploadProgress(progress);
    });

    try {
      await task;
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Create user in Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(
        formData.email, 
        formData.password
      );
      
      const { uid, email } = userCredential.user;
      
      // Upload image if selected
      let avatarUrl = null;
      if (formData.avatar) {
        avatarUrl = await uploadImage(uid);
      }

      // Create user document in Firestore
      const userData = {
        uid,
        name: formData.name,
        email,
        phone: formData.phone,
        avatar: avatarUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp()
      };
      
      await firestore()
        .collection('users')
        .doc(uid)
        .set(userData);
      
      dispatch(dispatchUser(userData));
      
    } catch (error) {
      setIsLoading(false);
      
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Email already in use.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid email address.');
      } else {
        Alert.alert('Sign up failed', error.message);
        console.error(error);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Account</Text>
        
        {/* Avatar Upload Section */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={selectImage} style={styles.avatarButton}>
            {formData.avatar ? (
              <Image source={{ uri: formData.avatar.uri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            placeholder="John Doe"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.errorInput]}
            placeholder="+1 234 567 8900"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.errorInput]}
            placeholder="At least 6 characters"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.errorInput]}
            placeholder="Confirm your password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        {isLoading && uploadProgress > 0 && (
          <View style={styles.progressContainer}>
            <Text>Uploading: {Math.round(uploadProgress)}%</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]} 
          onPress={handleSubmit} 
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;