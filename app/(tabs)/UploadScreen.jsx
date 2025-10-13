import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db, storage } from '../../config/firebase';

export default function UploadScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const handlePickMedia = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'video/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets[0]) {
        setMediaUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      if (mediaUri) {
        const response = await fetch(mediaUri);
        const blob = await response.blob();
        const filename = `posts/${user.uid}/${Date.now()}`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'postshaven'), {
        content,
        imageUrl,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL,
        location: 'Manchester, UK',
        createdAt: new Date().toISOString(),
        likes: [],
        likeCount: 0,
        comments: [],
        commentCount: 0
      });

      Alert.alert('Success', 'Post created successfully!');
      setContent('');
      setMediaUri(null);
      router.push('/(tabs)/HomeScreen');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create new post</Text>
      </View>

      <View style={styles.userInfo}>
        <Image 
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/60' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.userName}>{user?.displayName || 'Ardito Saputra'}</Text>
          <Text style={styles.location}>Manchester, UK</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Add Picture / Video / Audio Recording</Text>
      
      <View style={styles.mediaButtons}>
        <TouchableOpacity style={styles.mediaButton} onPress={handlePickMedia}>
          <Ionicons name="document-outline" size={40} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaButton}>
          <Ionicons name="mic-outline" size={40} color="#666" />
        </TouchableOpacity>
      </View>

      {mediaUri && (
        <View style={styles.mediaPreview}>
          <Image source={{ uri: mediaUri }} style={styles.previewImage} />
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => setMediaUri(null)}
          >
            <Ionicons name="close-circle" size={30} color="#FF0000" />
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={styles.textInput}
        placeholder="Type something here.."
        placeholderTextColor="#999"
        multiline
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity 
        style={[styles.postButton, loading && styles.postButtonDisabled]}
        onPress={handlePost}
        disabled={loading}
      >
        <Text style={styles.postButtonText}>
          {loading ? 'Posting...' : 'Posting Now'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  mediaButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  mediaButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  mediaPreview: {
    marginHorizontal: 20,
    marginBottom: 20,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  textInput: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    minHeight: 150,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: '#F4C430',
    marginHorizontal: 80,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
