import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/welcome-image.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Welcome to{'\n'}Haven</Text>
        
        <Text style={styles.subtitle}>
          First Time? Go and <Text style={styles.link} onPress={() => navigation.navigate('signup')}>Sign Up</Text>
          {'\n'}Coming Back? Go and <Text style={styles.link} onPress={() => navigation.navigate('login')}>Log In</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  link: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});

