import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>😄 Welcome to Mood Tracker App 🎯</Text>
      <Text style={styles.description}>
        This app is like your emotional diary 📖 but cooler 😎.  
        Here's what you can do:
        {'\n\n'}• Log your moods daily 😃😢😡😴  {'\n'} 
        • Time travel through your mood history 🕰️ {'\n'} 
        • Decode your feelings with stats 📊  {'\n'} 
        • Manage your secret identity (aka profile) 🕵️‍♀️
        {'\n\n'}Your mood matters... even if it's "🤷‍♀️ meh"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                        
    justifyContent: 'center',      
    alignItems: 'flex-end',          
    paddingHorizontal: 24,         
    backgroundColor: '#FAFAFA',    
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    color: '#555',
    lineHeight: 24,
  },
});
