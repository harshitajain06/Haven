import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ThankYouScreen() {
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.back();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/img_pleasant_surprise_cuate.svg')} 
        style={styles.image}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Thank You For{'\n'}Trusting Us !</Text>
      
      <Text style={styles.subtitle}>
        Hang on tight... Meanwhile, read <Text style={styles.link}>this{'\n'}book</Text> or play <Text style={styles.link}>this game</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
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

