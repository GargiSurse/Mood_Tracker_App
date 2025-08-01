import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Please enter email and password');
      return;
    }

    try {
      const usersString = await AsyncStorage.getItem('users');
      const users = usersString ? JSON.parse(usersString) : [];

      if (isRegistering) {
        const existingUser = users.find((u: any) => u.email === email);
        if (existingUser) {
          Alert.alert('User already exists. Please login.');
          return;
        }

        const newUser = { email, password };
        users.push(newUser);
        await AsyncStorage.setItem('users', JSON.stringify(users));
        Alert.alert('Registration successful! You can now log in.');
        setIsRegistering(false);
      } else {
        const found = users.find(
          (u: any) => u.email === email && u.password === password
        );
        if (!found) {
          Alert.alert('Invalid credentials');
          return;
        }

        await AsyncStorage.setItem('currentUser', JSON.stringify(found));
        Alert.alert('Login successful!');
        router.replace('/home');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={isRegistering ? 'Register' : 'Login'} onPress={handleAuth} />
      <Button
        title={`Switch to ${isRegistering ? 'Login' : 'Register'}`}
        onPress={() => setIsRegistering(!isRegistering)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 16,
  },
});
