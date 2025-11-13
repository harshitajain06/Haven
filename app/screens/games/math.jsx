import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const OPERATIONS = ['+', '-', '×', '÷'];

const generateQuestion = (level) => {
  let num1, num2, answer, operation;
  
  if (level === 1) {
    operation = OPERATIONS[Math.floor(Math.random() * 2)]; // + or -
    num1 = Math.floor(Math.random() * 20) + 1;
    num2 = Math.floor(Math.random() * 20) + 1;
  } else if (level === 2) {
    operation = OPERATIONS[Math.floor(Math.random() * 3)]; // +, -, or ×
    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * 50) + 1;
  } else {
    operation = OPERATIONS[Math.floor(Math.random() * 4)]; // All operations
    num1 = Math.floor(Math.random() * 100) + 1;
    num2 = Math.floor(Math.random() * 100) + 1;
  }

  switch (operation) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      if (num1 < num2) [num1, num2] = [num2, num1];
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      break;
    case '÷':
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = Math.floor(Math.random() * 12) + 1;
      num1 = num2 * answer;
      break;
  }

  return { num1, num2, operation, answer };
};

export default function MathGame() {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState(() => generateQuestion(1));
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const handleSubmit = () => {
    const userAnswer = parseInt(answer);
    if (userAnswer === question.answer) {
      setScore(score + 10);
      setStreak(streak + 1);
      setQuestionsAnswered(questionsAnswered + 1);
      
      if (streak + 1 >= 5 && level < 3) {
        Alert.alert('Level Up!', `Great job! Moving to level ${level + 1}!`);
        setLevel(level + 1);
        setStreak(0);
      } else {
        Alert.alert('Correct!', `+10 points! Streak: ${streak + 1}`);
      }
      
      setQuestion(generateQuestion(level));
      setAnswer('');
    } else {
      Alert.alert('Wrong Answer', `The correct answer is ${question.answer}`);
      setStreak(0);
      setQuestion(generateQuestion(level));
      setAnswer('');
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setQuestion(generateQuestion(1));
    setAnswer('');
  };

  const getOperationSymbol = (op) => {
    switch (op) {
      case '×': return '×';
      case '÷': return '÷';
      default: return op;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Math Adventure</Text>
        <TouchableOpacity onPress={resetGame}>
          <Ionicons name="refresh" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#FF6B6B" />
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color="#6C5CE7" />
            <Text style={styles.statValue}>Level {level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>Solve this problem:</Text>
          <View style={styles.questionDisplay}>
            <Text style={styles.questionText}>
              {question.num1} {getOperationSymbol(question.operation)} {question.num2} = ?
            </Text>
          </View>

          <TextInput
            style={styles.answerInput}
            placeholder="Enter your answer"
            keyboardType="numeric"
            value={answer}
            onChangeText={setAnswer}
          />

          <TouchableOpacity
            style={[styles.submitButton, !answer && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!answer}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progress</Text>
          <Text style={styles.progressText}>
            Questions answered: {questionsAnswered}
          </Text>
          <View style={styles.levelIndicator}>
            <Text style={styles.levelText}>Level {level}</Text>
            {streak >= 3 && (
              <View style={styles.streakIndicator}>
                <Ionicons name="flame" size={16} color="#FF6B6B" />
                <Text style={styles.streakText}>Hot streak!</Text>
              </View>
            )}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  questionLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  questionDisplay: {
    backgroundColor: '#F0F0F0',
    padding: 30,
    borderRadius: 15,
    marginBottom: 30,
    minWidth: 200,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  answerInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#6C5CE7',
    borderRadius: 10,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  levelIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C5CE7',
  },
  streakIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  streakText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

