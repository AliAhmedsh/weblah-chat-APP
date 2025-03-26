import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import styles from './Style';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { dispatchUser } from '../../redux/slices/userSlice';

const Login = () => { 
  const [loginMethod, setLoginMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation(); 
  const dispatch = useDispatch();
  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setIsLoading(true);
    try {
      let emailToLogin = identifier;
      let userData = null;
      if (loginMethod !== 'email') {
        const fieldToQuery = loginMethod === 'phone' ? 'phone' : 'name';
        
        const querySnapshot = await firestore()
          .collection('users')
          .where(fieldToQuery, '==', identifier)
          .limit(1)
          .get();
        if (querySnapshot.empty) {
          throw new Error(`No user found with this ${loginMethod}`);
        }
        userData = querySnapshot.docs[0].data();
        emailToLogin = userData.email;
      }
      const userCredential = await auth().signInWithEmailAndPassword(emailToLogin, password);
      if (!userData) {
        const userDoc = await firestore()
          .collection('users')
          .doc(userCredential.user.uid)
          .get();
        
        if (userDoc.exists) {
          userData = userDoc.data();
        }
      }
      if (userData) {
        dispatch(dispatchUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          ...userData
        }));
      }

    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }

      Alert.alert('Login Failed', errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignUp = () => {
    navigation.navigate('SignUp'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <View style={styles.methodContainer}>
        <TouchableOpacity 
          style={[styles.methodButton, loginMethod === 'email' && styles.activeMethod]}
          onPress={() => setLoginMethod('email')}
        >
          <Text>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.methodButton, loginMethod === 'phone' && styles.activeMethod]}
          onPress={() => setLoginMethod('phone')}
        >
          <Text>Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.methodButton, loginMethod === 'name' && styles.activeMethod]}
          onPress={() => setLoginMethod('name')}
        >
          <Text>Name</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={
          loginMethod === 'email' ? 'Enter your email' : 
          loginMethod === 'phone' ? 'Enter your phone number' : 
          'Enter your name'
        }
        value={identifier}
        onChangeText={setIdentifier}
        keyboardType={
          loginMethod === 'email' ? 'email-address' : 
          loginMethod === 'phone' ? 'phone-pad' : 
          'default'
        }
        autoCapitalize={loginMethod === 'name' ? 'words' : 'none'}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;