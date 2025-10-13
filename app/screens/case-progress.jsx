import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CaseProgressScreen() {
  const router = useRouter();

  const cases = [
    { id: '1', title: 'Case #001', status: 'In Progress', date: '2024-10-01', progress: 60 },
    { id: '2', title: 'Case #002', status: 'Pending', date: '2024-10-05', progress: 30 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Progress</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {cases.map((caseItem) => (
          <View key={caseItem.id} style={styles.caseCard}>
            <View style={styles.caseHeader}>
              <Text style={styles.caseTitle}>{caseItem.title}</Text>
              <Text style={[
                styles.caseStatus,
                caseItem.status === 'In Progress' ? styles.statusActive : styles.statusPending
              ]}>
                {caseItem.status}
              </Text>
            </View>
            <Text style={styles.caseDate}>Started: {caseItem.date}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${caseItem.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{caseItem.progress}% Complete</Text>
          </View>
        ))}

        {cases.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active cases</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  caseCard: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  caseStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  statusPending: {
    backgroundColor: '#FFC107',
    color: '#fff',
  },
  caseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F4C430',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

