import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WORD_LISTS = [
  {
    words: ['CAT', 'DOG', 'BIRD', 'FISH', 'LION'],
    grid: [
      ['C', 'A', 'T', 'X', 'Y'],
      ['D', 'O', 'G', 'Z', 'W'],
      ['B', 'I', 'R', 'D', 'V'],
      ['F', 'I', 'S', 'H', 'U'],
      ['L', 'I', 'O', 'N', 'T'],
    ],
  },
  {
    words: ['SUN', 'MOON', 'STAR', 'EARTH', 'PLANET'],
    grid: [
      ['S', 'U', 'N', 'X', 'Y'],
      ['M', 'O', 'O', 'N', 'Z'],
      ['S', 'T', 'A', 'R', 'W'],
      ['E', 'A', 'R', 'T', 'H'],
      ['P', 'L', 'A', 'N', 'E'],
    ],
  },
];

export default function WordSearchGame() {
  const router = useRouter();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);

  const puzzle = WORD_LISTS[currentPuzzle];

  const handleCellPress = (row, col) => {
    const cellKey = `${row}-${col}`;
    if (selectedCells.includes(cellKey)) {
      setSelectedCells(selectedCells.filter(c => c !== cellKey));
    } else {
      setSelectedCells([...selectedCells, cellKey]);
    }
  };

  const checkWord = () => {
    if (selectedCells.length === 0) return;

    const selectedLetters = selectedCells
      .map(cell => {
        const [row, col] = cell.split('-').map(Number);
        return puzzle.grid[row][col];
      })
      .join('');

    const reversed = selectedLetters.split('').reverse().join('');

    for (const word of puzzle.words) {
      if ((selectedLetters === word || reversed === word) && !foundWords.includes(word)) {
        setFoundWords([...foundWords, word]);
        setSelectedCells([]);
        if (foundWords.length + 1 === puzzle.words.length) {
          Alert.alert('Congratulations!', 'You found all words!');
        } else {
          Alert.alert('Great!', `You found "${word}"!`);
        }
        return;
      }
    }

    Alert.alert('Not a word', 'Try selecting a different combination');
    setSelectedCells([]);
  };

  const resetPuzzle = () => {
    setFoundWords([]);
    setSelectedCells([]);
    if (currentPuzzle < WORD_LISTS.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
    } else {
      setCurrentPuzzle(0);
    }
  };

  const isCellSelected = (row, col) => {
    return selectedCells.includes(`${row}-${col}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Word Search</Text>
        <TouchableOpacity onPress={resetPuzzle}>
          <Ionicons name="refresh" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Puzzle {currentPuzzle + 1} of {WORD_LISTS.length}
          </Text>
          <Text style={styles.infoText}>
            Found: {foundWords.length} / {puzzle.words.length}
          </Text>
        </View>

        <View style={styles.wordsList}>
          <Text style={styles.wordsTitle}>Find these words:</Text>
          <View style={styles.wordsContainer}>
            {puzzle.words.map((word, index) => (
              <View
                key={index}
                style={[
                  styles.wordTag,
                  foundWords.includes(word) && styles.wordFound,
                ]}
              >
                <Text
                  style={[
                    styles.wordText,
                    foundWords.includes(word) && styles.wordTextFound,
                  ]}
                >
                  {word}
                </Text>
                {foundWords.includes(word) && (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.gridContainer}>
          {puzzle.grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((cell, colIndex) => (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={[
                    styles.gridCell,
                    isCellSelected(rowIndex, colIndex) && styles.gridCellSelected,
                  ]}
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                >
                  <Text style={styles.cellText}>{cell}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.checkButton} onPress={checkWord}>
          <Text style={styles.checkButtonText}>Check Word</Text>
        </TouchableOpacity>
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
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD93D',
  },
  wordsList: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  wordsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  wordTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FFF9C4',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD93D',
    gap: 5,
  },
  wordFound: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  wordTextFound: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  gridContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  gridCellSelected: {
    backgroundColor: '#FFD93D',
    borderColor: '#FFC107',
  },
  cellText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkButton: {
    backgroundColor: '#FFD93D',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

