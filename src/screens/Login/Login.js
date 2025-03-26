import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from './Style';
import { useNavigation } from '@react-navigation/native'

const Login = () => { 
  const [loginMethod, setLoginMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); 
  const handleLogin = () => {
    console.log('Login attempt with:', { identifier, password });
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
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login