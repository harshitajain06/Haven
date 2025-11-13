import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BREATHING_EXERCISES = [
  { name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8, description: 'Calming technique for relaxation' },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, hold2: 4, description: 'Equal intervals for focus' },
  { name: 'Deep Breathing', inhale: 5, hold: 0, exhale: 5, description: 'Simple deep breaths' },
];

export default function MindfulnessGame() {
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [countdown, setCountdown] = useState(0);
  const [scale] = useState(new Animated.Value(1));

  const exercise = BREATHING_EXERCISES[selectedExercise];

  useEffect(() => {
    if (isActive) {
      startBreathingCycle();
    } else {
      scale.setValue(1);
    }
  }, [isActive, selectedExercise]);

  useEffect(() => {
    if (isActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isActive && countdown === 0) {
      nextPhase();
    }
  }, [countdown, isActive]);

  const startBreathingCycle = () => {
    setPhase('inhale');
    setCountdown(exercise.inhale);
    animateBreath('in');
  };

  const animateBreath = (direction) => {
    const toValue = direction === 'in' ? 1.3 : 1;
    Animated.timing(scale, {
      toValue,
      duration: (direction === 'in' ? exercise.inhale : exercise.exhale) * 1000,
      useNativeDriver: true,
    }).start();
  };

  const nextPhase = () => {
    if (phase === 'inhale') {
      if (exercise.hold > 0) {
        setPhase('hold');
        setCountdown(exercise.hold);
        scale.setValue(1.3);
      } else {
        setPhase('exhale');
        setCountdown(exercise.exhale);
        animateBreath('out');
      }
    } else if (phase === 'hold') {
      setPhase('exhale');
      setCountdown(exercise.exhale);
      animateBreath('out');
    } else if (phase === 'exhale') {
      if (exercise.hold2 && exercise.hold2 > 0) {
        setPhase('hold2');
        setCountdown(exercise.hold2);
        scale.setValue(1);
      } else {
        startBreathingCycle();
      }
    } else if (phase === 'hold2') {
      startBreathingCycle();
    }
  };

  const toggleExercise = () => {
    setIsActive(!isActive);
    if (!isActive) {
      startBreathingCycle();
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return '#4CAF50';
      case 'hold': return '#FF9800';
      case 'exhale': return '#2196F3';
      case 'hold2': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mindfulness</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.exerciseSelector}>
          <Text style={styles.sectionTitle}>Choose an Exercise</Text>
          {BREATHING_EXERCISES.map((ex, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.exerciseButton,
                selectedExercise === index && styles.selectedExercise,
              ]}
              onPress={() => {
                setSelectedExercise(index);
                setIsActive(false);
              }}
            >
              <Text style={[
                styles.exerciseButtonText,
                selectedExercise === index && styles.selectedExerciseText,
              ]}>
                {ex.name}
              </Text>
              <Text style={styles.exerciseDescription}>{ex.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.breathingContainer}>
          <Text style={styles.instructionText}>
            {isActive ? 'Follow the circle' : 'Tap Start to begin'}
          </Text>
          
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale }],
                backgroundColor: getPhaseColor(),
              },
            ]}
          >
            {isActive && (
              <>
                <Text style={styles.phaseText}>{getPhaseText()}</Text>
                <Text style={styles.countdownText}>{countdown}</Text>
              </>
            )}
          </Animated.View>

          <TouchableOpacity
            style={[styles.startButton, isActive && styles.stopButton]}
            onPress={toggleExercise}
          >
            <Ionicons
              name={isActive ? 'pause' : 'play'}
              size={24}
              color="#fff"
            />
            <Text style={styles.startButtonText}>
              {isActive ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Benefits of Breathing Exercises</Text>
          <Text style={styles.infoText}>
            • Reduces stress and anxiety{'\n'}
            • Improves focus and concentration{'\n'}
            • Promotes better sleep{'\n'}
            • Enhances emotional well-being
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  exerciseSelector: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  exerciseButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedExercise: {
    backgroundColor: '#C7F5D9',
    borderColor: '#4CAF50',
  },
  exerciseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  selectedExerciseText: {
    color: '#2E7D32',
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#666',
  },
  breathingContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 30,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  phaseText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 8,
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
});

