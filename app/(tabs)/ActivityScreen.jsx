import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ActivityScreen() {
  const router = useRouter();

  const activities = [
    { icon: 'notifications-outline', title: 'Notifications', route: '/screens/notifications' },
    { icon: 'chatbubbles-outline', title: 'Messages', route: '/screens/messages' },
    { icon: 'calendar-outline', title: 'Case Progress', route: '/screens/case-progress' },
    { icon: 'eye-outline', title: 'Adult Zone', route: '/screens/adult-zone' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      <View style={styles.content}>
        {activities.map((activity, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.activityCard}
            onPress={() => router.push(activity.route)}
          >
            <Ionicons name={activity.icon} size={40} color="#F4C430" />
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  activityTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
});
