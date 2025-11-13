import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const STORY_TEMPLATES = [
  {
    title: 'Adventure Story',
    template: 'Once upon a time, there was a brave {character} who lived in {place}. One day, they discovered {object} and decided to {action}. Along the way, they met {friend} who helped them {goal}. In the end, they learned that {lesson}.',
    prompts: ['character', 'place', 'object', 'action', 'friend', 'goal', 'lesson'],
  },
  {
    title: 'Mystery Story',
    template: 'In the quiet town of {place}, a mysterious {object} appeared. {character} was determined to solve the mystery. They searched for clues and found {clue}. With the help of {friend}, they discovered that {secret}. The mystery was solved when they realized {solution}.',
    prompts: ['place', 'object', 'character', 'clue', 'friend', 'secret', 'solution'],
  },
  {
    title: 'Fantasy Story',
    template: 'In a magical land called {place}, there lived a {character} with special powers. They possessed a {object} that could {power}. When {event} happened, they had to use their powers to {action}. With courage and help from {friend}, they saved the day and learned {lesson}.',
    prompts: ['place', 'character', 'object', 'power', 'event', 'action', 'friend', 'lesson'],
  },
];

export default function StoryGame() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [answers, setAnswers] = useState({});
  const [story, setStory] = useState('');

  const handleInputChange = (prompt, value) => {
    setAnswers({
      ...answers,
      [prompt]: value,
    });
  };

  const generateStory = () => {
    const template = STORY_TEMPLATES[selectedTemplate];
    let generatedStory = template.template;
    
    template.prompts.forEach((prompt) => {
      const answer = answers[prompt] || `[${prompt}]`;
      generatedStory = generatedStory.replace(`{${prompt}}`, answer);
    });

    setStory(generatedStory);
  };

  const resetStory = () => {
    setAnswers({});
    setStory('');
  };

  const shareStory = () => {
    if (story) {
      Alert.alert('Story Ready!', 'Your story has been created. You can copy it or share it with others!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Story Builder</Text>
        <TouchableOpacity onPress={resetStory}>
          <Ionicons name="refresh" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.templateSelector}>
          <Text style={styles.sectionTitle}>Choose a Story Template</Text>
          <View style={styles.templateButtons}>
            {STORY_TEMPLATES.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.templateButton,
                  selectedTemplate === index && styles.selectedTemplate,
                ]}
                onPress={() => {
                  setSelectedTemplate(index);
                  setAnswers({});
                  setStory('');
                }}
              >
                <Text style={[
                  styles.templateButtonText,
                  selectedTemplate === index && styles.selectedTemplateText,
                ]}>
                  {template.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputsContainer}>
          <Text style={styles.sectionTitle}>Fill in the Blanks</Text>
          {STORY_TEMPLATES[selectedTemplate].prompts.map((prompt) => (
            <View key={prompt} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{prompt.charAt(0).toUpperCase() + prompt.slice(1)}:</Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${prompt}...`}
                value={answers[prompt] || ''}
                onChangeText={(value) => handleInputChange(prompt, value)}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={generateStory}>
          <Text style={styles.generateButtonText}>Generate Story</Text>
        </TouchableOpacity>

        {story ? (
          <View style={styles.storyContainer}>
            <Text style={styles.storyTitle}>Your Story:</Text>
            <View style={styles.storyBox}>
              <Text style={styles.storyText}>{story}</Text>
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={shareStory}>
              <Ionicons name="share-outline" size={20} color="#fff" />
              <Text style={styles.shareButtonText}>Share Story</Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  templateSelector: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  templateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  templateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplate: {
    backgroundColor: '#AA96DA',
    borderColor: '#AA96DA',
  },
  templateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedTemplateText: {
    color: '#fff',
  },
  inputsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#F9F9F9',
  },
  generateButton: {
    backgroundColor: '#AA96DA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  storyBox: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    minHeight: 150,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AA96DA',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

