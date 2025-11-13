import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

export default function MemoryGame() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const pairs = [...EMOJIS, ...EMOJIS];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled.map((emoji, index) => ({ id: index, emoji, flipped: false })));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardPress = (index) => {
    if (flipped.length === 2 || matched.includes(index) || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
            setGameWon(true);
            Alert.alert('Congratulations!', `You won in ${moves + 1} moves!`);
          }, 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Match</Text>
        <TouchableOpacity onPress={startNewGame}>
          <Ionicons name="refresh" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.gameContainer}>
        <View style={styles.stats}>
          <Text style={styles.statText}>Moves: {moves}</Text>
          <Text style={styles.statText}>Matched: {matched.length / 2} / {EMOJIS.length}</Text>
        </View>

        <View style={styles.grid}>
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, isFlipped && styles.cardFlipped]}
                onPress={() => handleCardPress(index)}
                disabled={isFlipped}
              >
                <Text style={styles.cardText}>
                  {isFlipped ? card.emoji : '?'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {gameWon && (
          <TouchableOpacity style={styles.newGameButton} onPress={startNewGame}>
            <Text style={styles.newGameText}>Play Again</Text>
          </TouchableOpacity>
        )}
      </View>
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
  gameContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  card: {
    width: 70,
    height: 70,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardFlipped: {
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 32,
  },
  newGameButton: {
    marginTop: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  newGameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

