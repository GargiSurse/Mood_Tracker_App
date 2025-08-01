import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    if (username.trim() && password.trim()) {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Register & Dive Into the Full Experience!</Text>
      
      <TextInput
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
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
        <Button title="Register" onPress={handleRegister} color="#FF7F50" />
      </View>

      <Text style={styles.linkText}>
        Already have an account?{' '}
        <Text
          style={styles.linkAction}
          onPress={() => router.replace('/(auth)/login')}
        >
          Login
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
    backgroundColor: '#FAF9F6', // light neutral background
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
