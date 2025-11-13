import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QUIZ_QUESTIONS = [
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Jupiter', 'Saturn', 'Neptune'],
    correct: 1,
  },
  {
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    correct: 2,
  },
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct: 2,
  },
  {
    question: 'What do bees make?',
    options: ['Honey', 'Milk', 'Butter', 'Cheese'],
    correct: 0,
  },
  {
    question: 'How many days are in a week?',
    options: ['5', '6', '7', '8'],
    correct: 2,
  },
];

export default function QuizGame() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      Alert.alert(
        'Quiz Complete!',
        `Your score: ${score + (selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correct ? 1 : 0)} / ${QUIZ_QUESTIONS.length}`,
        [{ text: 'Play Again', onPress: resetQuiz }]
      );
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getOptionStyle = (index) => {
    if (!showResult) return styles.option;
    if (index === QUIZ_QUESTIONS[currentQuestion].correct) {
      return [styles.option, styles.correctOption];
    }
    if (index === selectedAnswer && index !== QUIZ_QUESTIONS[currentQuestion].correct) {
      return [styles.option, styles.wrongOption];
    }
    return styles.option;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Knowledge Quiz</Text>
        <TouchableOpacity onPress={resetQuiz}>
          <Ionicons name="refresh" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {QUIZ_QUESTIONS[currentQuestion].question}
          </Text>

          <View style={styles.optionsContainer}>
            {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={getOptionStyle(index)}
                onPress={() => handleAnswer(index)}
                disabled={showResult}
              >
                <Text style={styles.optionText}>{option}</Text>
                {showResult && index === QUIZ_QUESTIONS[currentQuestion].correct && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
                {showResult && index === selectedAnswer && index !== QUIZ_QUESTIONS[currentQuestion].correct && (
                  <Ionicons name="close-circle" size={24} color="#F44336" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {showResult && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish'}
              </Text>
            </TouchableOpacity>
          )}
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95E1D3',
  },
  questionCard: {
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 25,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#95E1D3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

