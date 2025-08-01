import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
  const [name, setName] = useState('N/A');
  const [email, setEmail] = useState('N/A');
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      console.log('Fetched:', storedName, storedEmail);
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    };
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    Alert.alert('Hold up!', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('loggedInUser');
            router.replace('/(auth)/login');
          } catch (error) {
            Alert.alert('Logout Failed', 'Something went wrong.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
        style={styles.avatar}
      />

      <Text style={styles.title}>👤 Account Info</Text>

      <Text style={styles.label}>Name:</Text>
      <Text style={styles.text}>{name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.text}>{email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
