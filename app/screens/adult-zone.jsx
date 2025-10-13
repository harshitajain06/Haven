import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdultZoneScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/img_badges.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Welcome to{'\n'}Adult Zone</Text>
        
        <Text style={styles.subtitle}>
          Are You Under the Age of 18? <Text style={styles.link} onPress={() => router.back()}>Go Back</Text>
          {'\n'}Upload your ID Proof <Text style={styles.link}>Here</Text>
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => {
          // In a real app, you would verify age/ID here
          router.push('/screens/thank-you');
        }}
      >
        <Text style={styles.startButtonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
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
  startButton: {
    backgroundColor: '#F4C430',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 60,
  },
  startButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

