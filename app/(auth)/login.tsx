import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (email.trim() && password.trim()) {
      const defaultName = 'Moody User';

      await AsyncStorage.setItem('loggedInUser', email);
      await AsyncStorage.setItem('userName', defaultName);
      await AsyncStorage.setItem('userEmail', email);

      router.replace('/(tabs)/home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Ready to Explore? Log In Now!</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#FF7F50" />
      </View>

      <Text style={styles.linkText}>
        Don’t have an account?{' '}
        <Text
          style={styles.linkAction}
          onPress={() => router.push('/(auth)/register')}
        >
          Register
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FAF9F6', // Light neutral background
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black', 
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D88A94', 
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  linkText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  linkAction: {
    color: '#E85A4F', 
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
