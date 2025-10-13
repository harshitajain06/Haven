import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Step3Screen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/img_finding_brilliant.svg')} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Step - 3</Text>
        <Text style={styles.description}>
          Launch A Secret Investigation And Get{'\n'}Help In Your Case!
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.getStartedButton}
        onPress={() => navigation.replace('Drawer')}
      >
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
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
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    lineHeight: 22,
  },
  getStartedButton: {
    backgroundColor: '#F4C430',
    marginHorizontal: 40,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  activeDot: {
    backgroundColor: '#F4C430',
  },
});

