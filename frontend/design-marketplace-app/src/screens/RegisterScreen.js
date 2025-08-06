import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // default
  const [email, setEmail] = useState('');

  const register = async () => {
    try {
      const response = await axios.post('http://192.168.1.55:8000/api/register/', {
        username,
        password,
        role,
        email,
      });
      const token = response.data.token;
      await SecureStore.setItemAsync('userToken', token);
      alert('Registration Successful!');
      navigation.replace('DesignList');
    }catch (error) {
  if (error.response) {
    // Server responded with a status code outside 2xx
    console.log('Registration error response:', error.response.data);
    alert('Registration failed: ' + JSON.stringify(error.response.data));
  } else if (error.request) {
    // Request was made but no response received
    console.log('No response received:', error.request);
    alert('No response from server. Check your connection.');
  } else {
    // Something else caused the error
    console.log('Error', error.message);
    alert('Registration error: ' + error.message);
  }
}

  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Text>Role ('client' or 'designer')</Text>
      <TextInput
        value={role}
        onChangeText={setRole}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        autoCapitalize="none"
      />
      <Button title="Register" onPress={register} />
      <View style={{ marginTop: 10 }}>
        <Button title="Go to Login" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
