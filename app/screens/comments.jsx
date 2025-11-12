import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    addDoc,
    collection,
    doc,
    increment,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../../config/firebase';

export default function CommentsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const postId = params.postId;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    // Load post data
    const postRef = doc(db, 'postshaven', postId);
    const unsubscribePost = onSnapshot(postRef, (snapshot) => {
      if (snapshot.exists()) {
        setPost({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    });

    // Load comments - using subcollection for better scalability
    const commentsRef = collection(db, 'postshaven', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      
      // Scroll to bottom when new comment is added
      setTimeout(() => {
        if (flatListRef.current && commentsData.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    });

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [postId]);

  const handleAddComment = async () => {
    if (!comment.trim() || !userId || !postId) return;

    try {
      const commentsRef = collection(db, 'postshaven', postId, 'comments');
      await addDoc(commentsRef, {
        text: comment.trim(),
        userId: userId,
        userName: 'Anonymous',
        createdAt: serverTimestamp(),
      });

      // Update comment count in post
      const postRef = doc(db, 'postshaven', postId);
      await updateDoc(postRef, {
        commentCount: increment(1)
      });

      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderComment = ({ item }) => {
    const anonymousAvatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${item.userId || 'anonymous'}&size=60`;
    
    return (
      <View style={styles.commentCard}>
        <Image 
          source={{ uri: anonymousAvatarUrl }}
          style={styles.avatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUserName}>Anonymous</Text>
            <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comments</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 28 }} />
      </View>

      {post && (
        <View style={styles.postPreview}>
          <View style={styles.postPreviewHeader}>
            <Image 
              source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=anonymous&size=60` }}
              style={styles.postPreviewAvatar}
            />
            <Text style={styles.postPreviewUser}>Anonymous</Text>
          </View>
          {post.imageUrl && (
            <Image 
              source={{ uri: post.imageUrl }}
              style={styles.postPreviewImage}
              resizeMode={Platform.OS === 'web' ? 'contain' : 'cover'}
            />
          )}
          <Text style={styles.postPreviewText} numberOfLines={3}>
            {post.content}
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#999"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !comment.trim() && styles.sendButtonDisabled]}
          onPress={handleAddComment}
          disabled={!comment.trim()}
        >
          <Ionicons name="send" size={20} color={comment.trim() ? "#000" : "#999"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  postPreview: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  postPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postPreviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  postPreviewUser: {
    fontSize: 14,
    fontWeight: '600',
  },
  postPreviewImage: {
    width: '100%',
    ...(Platform.OS === 'web' 
      ? {
          maxHeight: 600,
          minHeight: 300,
        }
      : {
          height: 400,
          aspectRatio: 16 / 9,
        }
    ),
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginBottom: 10,
  },
  postPreviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  commentCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4C430',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});

