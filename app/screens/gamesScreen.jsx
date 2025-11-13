import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GamesScreen() {
  const router = useRouter();

  const games = [
    {
      id: 'memory',
      icon: 'albums-outline',
      title: 'Memory Match',
      description: 'Test your memory by matching pairs of cards',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FF8E8E'],
    },
    {
      id: 'puzzle',
      icon: 'grid-outline',
      title: 'Puzzle Challenge',
      description: 'Solve fun puzzles and brain teasers',
      color: '#4ECDC4',
      gradient: ['#4ECDC4', '#6EDDD6'],
    },
    {
      id: 'quiz',
      icon: 'help-circle-outline',
      title: 'Knowledge Quiz',
      description: 'Answer questions and learn new things',
      color: '#95E1D3',
      gradient: ['#95E1D3', '#B5F1E3'],
    },
    {
      id: 'coloring',
      icon: 'color-palette-outline',
      title: 'Coloring Book',
      description: 'Express yourself through colors and art',
      color: '#F38181',
      gradient: ['#F38181', '#FFA1A1'],
    },
    {
      id: 'story',
      icon: 'book-outline',
      title: 'Story Builder',
      description: 'Create your own stories and adventures',
      color: '#AA96DA',
      gradient: ['#AA96DA', '#C4B5E5'],
    },
    {
      id: 'mindfulness',
      icon: 'leaf-outline',
      title: 'Mindfulness',
      description: 'Relax and practice breathing exercises',
      color: '#C7F5D9',
      gradient: ['#C7F5D9', '#E7FDE9'],
    },
    {
      id: 'wordsearch',
      icon: 'text-outline',
      title: 'Word Search',
      description: 'Find hidden words in the grid',
      color: '#FFD93D',
      gradient: ['#FFD93D', '#FFE66D'],
    },
    {
      id: 'math',
      icon: 'calculator-outline',
      title: 'Math Adventure',
      description: 'Solve math problems and level up',
      color: '#6C5CE7',
      gradient: ['#6C5CE7', '#8B7EE8'],
    },
  ];

  const handleGamePress = (gameId) => {
    router.push(`/screens/games/${gameId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Games</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Choose a game to play and have fun while learning!
        </Text>

        <View style={styles.gamesGrid}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { borderLeftColor: game.color }]}
              onPress={() => handleGamePress(game.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${game.color}20` }]}>
                <Ionicons name={game.icon} size={32} color={game.color} />
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  gamesGrid: {
    gap: 15,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

