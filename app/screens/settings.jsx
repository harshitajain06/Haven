import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase';

export default function SettingsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const settingsOptions = [
    { title: 'Account and App', icon: 'person-outline', route: '/screens/account' },
    { title: 'Privacy & Security', icon: 'shield-checkmark-outline', route: '/screens/privacy' },
    { title: 'Notification', icon: 'notifications-outline', route: '/screens/notifications' },
    { title: 'Case Progress', icon: 'stats-chart-outline', route: '/screens/case-progress' },
    { title: 'Access Adult Zone', icon: 'eye-outline', route: '/screens/adult-zone' },
    { title: 'Post Controls', icon: 'file-tray-full-outline', route: '/screens/post-controls' },
    { title: 'Parental Control', icon: 'people-outline', route: '/screens/parental-control' },
    { title: 'Donations', icon: 'gift-outline', route: '/screens/donations' },
    { title: 'Help And Support', icon: 'help-circle-outline', route: '/screens/help-support' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.profileSection}>
        <Image 
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/80' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.displayName || 'Ardito Saputra'}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a setting.."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.optionsList}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.optionItem}
            onPress={() => {
              if (option.route === '/screens/adult-zone') {
                router.push('/screens/adult-zone');
              } else if (option.route === '/screens/notifications') {
                router.push('/screens/notifications');
              } else {
                // Other routes can be added later
                console.log('Navigate to:', option.route);
              }
            }}
          >
            <View style={styles.optionLeft}>
              <Ionicons name={option.icon} size={24} color="#000" />
              <Text style={styles.optionTitle}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  profileInfo: {
    marginLeft: 15,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    marginLeft: 15,
  },
});

