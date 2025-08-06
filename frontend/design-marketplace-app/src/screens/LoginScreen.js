import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const buttonRef = useRef(null);

  const login = async () => {
    if (!username || !password) {
      Alert.alert('Input Error', 'Both fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.55:8000/api-token-auth/', {
        username,
        password,
      });

      const token = response.data.token;
      await SecureStore.setItemAsync('userToken', token);
      Alert.alert('Success', 'Login Successful');
      navigation.replace('Home');
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Login Failed', 'Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#6B46C1', '#E9D5FF']}
      style={styles.container}
    >
      <Animatable.Text
        ref={titleRef}
        animation="pulse"
        easing="ease-in-out"
        iterationCount="infinite"
        style={styles.title}
      >
        DesignSphere
      </Animatable.Text>

      <Animatable.View
        ref={inputRef1}
        animation="fadeInUp"
        delay={200}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#B794F6"
          value={username}
          autoCapitalize="none"
          onChangeText={setUsername}
        />
      </Animatable.View>

      <Animatable.View
        ref={inputRef2}
        animation="fadeInUp"
        delay={400}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B794F6"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </Animatable.View>

      <Animatable.View
        ref={buttonRef}
        animation="bounceIn"
        delay={600}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={login}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View
        animation="bounceIn"
        delay={800}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <LinearGradient
            colors={['#4C51BF', '#7F9CF5']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Register</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {loading && (
        <Animatable.View animation="rotate" iterationCount="infinite">
          <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 20 }} />
        </Animatable.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    padding: 15,
    fontSize: 16,
    color: '#FFF',
    borderRadius: 15,
  },
  button: {
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
    transform: [{ scale: 1 }],
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});