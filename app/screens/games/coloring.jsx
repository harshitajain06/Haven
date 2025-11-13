import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Purple', value: '#800080' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Brown', value: '#A52A2A' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
];

const SHAPES = ['Circle', 'Square', 'Triangle', 'Star', 'Heart'];

export default function ColoringGame() {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [shapeColors, setShapeColors] = useState({});

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleShapePress = (shape) => {
    setShapeColors({
      ...shapeColors,
      [shape]: selectedColor,
    });
  };

  const resetCanvas = () => {
    setShapeColors({});
  };

  const renderShape = (shape) => {
    const shapeColor = shapeColors[shape] || '#E0E0E0';
    return (
      <TouchableOpacity
        key={shape}
        style={[styles.shapeContainer, { backgroundColor: shapeColor }]}
        onPress={() => handleShapePress(shape)}
      >
        <Text style={styles.shapeText}>{shape}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coloring Book</Text>
        <TouchableOpacity onPress={resetCanvas}>
          <Ionicons name="refresh" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.colorPalette}>
          <Text style={styles.sectionTitle}>Choose a Color</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorButton,
                  { backgroundColor: color.value },
                  selectedColor === color.value && styles.selectedColor,
                ]}
                onPress={() => handleColorSelect(color.value)}
              >
                {selectedColor === color.value && (
                  <Ionicons name="checkmark" size={20} color={color.value === '#FFFFFF' ? '#000' : '#fff'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.canvasContainer}>
          <Text style={styles.sectionTitle}>Tap shapes to color them</Text>
          <View style={styles.canvas}>
            {SHAPES.map((shape) => renderShape(shape))}
          </View>
        </View>

        <View style={styles.currentColorContainer}>
          <Text style={styles.currentColorText}>Current Color:</Text>
          <View style={[styles.currentColorDisplay, { backgroundColor: selectedColor }]} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  colorPalette: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColor: {
    borderColor: '#F38181',
    borderWidth: 4,
  },
  canvasContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  canvas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
  },
  shapeContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  shapeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  currentColorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentColorDisplay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
});

