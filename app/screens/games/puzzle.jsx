import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PUZZLES = [
  { question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', answer: 'echo' },
  { question: 'The more you take, the more you leave behind. What am I?', answer: 'footsteps' },
  { question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?', answer: 'map' },
  { question: 'What has keys but no locks, space but no room, and you can enter but not go inside?', answer: 'keyboard' },
  { question: 'I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?', answer: 'pencil' },
];

export default function PuzzleGame() {
  const router = useRouter();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (answer.toLowerCase().trim() === PUZZLES[currentPuzzle].answer.toLowerCase()) {
      setScore(score + 1);
      Alert.alert('Correct!', 'Great job! Moving to next puzzle...');
      setAnswer('');
      setShowHint(false);
      if (currentPuzzle < PUZZLES.length - 1) {
        setCurrentPuzzle(currentPuzzle + 1);
      } else {
        Alert.alert('Congratulations!', `You solved all puzzles! Final score: ${score + 1}/${PUZZLES.length}`);
        setCurrentPuzzle(0);
        setScore(0);
      }
    } else {
      Alert.alert('Wrong Answer', 'Try again!');
    }
  };

  const resetGame = () => {
    setCurrentPuzzle(0);
    setScore(0);
    setAnswer('');
    setShowHint(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Puzzle Challenge</Text>
        <TouchableOpacity onPress={resetGame}>
          <Ionicons name="refresh" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score} / {PUZZLES.length}</Text>
          <Text style={styles.puzzleNumber}>Puzzle {currentPuzzle + 1} of {PUZZLES.length}</Text>
        </View>

        <View style={styles.puzzleCard}>
          <Text style={styles.questionText}>{PUZZLES[currentPuzzle].question}</Text>
          
          {showHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                Hint: The answer has {PUZZLES[currentPuzzle].answer.length} letters
              </Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Enter your answer..."
            value={answer}
            onChangeText={setAnswer}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.hintButton} onPress={() => setShowHint(!showHint)}>
              <Ionicons name="bulb-outline" size={20} color="#4ECDC4" />
              <Text style={styles.hintButtonText}>Hint</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
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
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  puzzleNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  puzzleCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    lineHeight: 26,
  },
  hintContainer: {
    backgroundColor: '#E8F8F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  hintText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hintButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8F5',
    padding: 15,
    borderRadius: 10,
    gap: 5,
  },
  hintButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

