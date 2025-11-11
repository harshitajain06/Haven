import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

export default function CaseProgressScreen() {
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch case studies for current user
    const q = query(
      collection(db, 'caseStudies'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const casesData = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        return {
          id: doc.id,
          title: data.title || `Case #${doc.id.substring(0, 8).toUpperCase()}`,
          status: data.status || 'In Progress',
          date: createdAt.toLocaleDateString(),
          progress: data.progress || 0,
          conversationId: data.conversationId,
          milestones: data.milestones || []
        };
      });
      setCases(casesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching case studies:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

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
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading cases...</Text>
          </View>
        ) : (
          <>
            {cases.map((caseItem) => (
              <TouchableOpacity 
                key={caseItem.id} 
                style={styles.caseCard}
                onPress={() => {
                  if (caseItem.conversationId) {
                    router.push(`/screens/chat?id=${caseItem.conversationId}&name=Child Protection Services`);
                  }
                }}
              >
                <View style={styles.caseHeader}>
                  <Text style={styles.caseTitle}>{caseItem.title}</Text>
                  <Text style={[
                    styles.caseStatus,
                    caseItem.status === 'In Progress' ? styles.statusActive : 
                    caseItem.status === 'Completed' ? styles.statusCompleted : styles.statusPending
                  ]}>
                    {caseItem.status}
                  </Text>
                </View>
                <Text style={styles.caseDate}>Started: {caseItem.date}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${caseItem.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{caseItem.progress}% Complete</Text>
                
                {/* Show milestones */}
                {caseItem.milestones && caseItem.milestones.length > 0 && (
                  <View style={styles.milestonesContainer}>
                    <Text style={styles.milestonesTitle}>Milestones:</Text>
                    {caseItem.milestones.map((milestone, index) => (
                      <View key={index} style={styles.milestoneItem}>
                        <Ionicons 
                          name={milestone.completed ? "checkmark-circle" : "ellipse-outline"} 
                          size={16} 
                          color={milestone.completed ? "#4CAF50" : "#999"} 
                        />
                        <Text style={[
                          styles.milestoneText,
                          milestone.completed && styles.milestoneCompleted
                        ]}>
                          {milestone.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {cases.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No active cases</Text>
                <Text style={styles.emptySubtext}>Start a conversation to create a case study</Text>
              </View>
            )}
          </>
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
  milestonesContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  milestonesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  milestoneCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  statusCompleted: {
    backgroundColor: '#2196F3',
    color: '#fff',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
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

