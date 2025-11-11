import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { arrayRemove, arrayUnion, collection, doc, getDocs, increment, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

export default function HomeScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'postshaven'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'postshaven'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId, likes = []) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const postRef = doc(db, 'posts', postId);
    const hasLiked = likes.includes(userId);

    try {
      if (hasLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
          likeCount: increment(-1)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          likeCount: increment(1)
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  useEffect(() => {
    if (refreshing && Platform.OS === 'web') {
      const animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => animation.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [refreshing, rotateAnim]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPosts();
    } catch (error) {
      console.error('Error refreshing posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderPost = ({ item }) => {
    const userId = auth.currentUser?.uid;
    const hasLiked = item.likes?.includes(userId);
    
    // Use the same avatar logic as UploadScreen - DiceBear avatar for anonymous users
    const anonymousAvatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=anonymous&size=60`;

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image 
            source={{ uri: anonymousAvatarUrl }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Anonymous</Text>
            {/* <Text style={styles.location}>{item.location || 'Location'}</Text> */}
          </View>
        </View>

        {item.imageUrl && (
          <Image 
            source={{ uri: item.imageUrl }}
            style={styles.postImage}
            resizeMode={Platform.OS === 'web' ? 'contain' : 'cover'}
          />
        )}

        <View style={styles.postContent}>
          <Text style={styles.postText}>{item.content}</Text>
        </View>

        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item.id, item.likes)}
          >
            <Ionicons 
              name={hasLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={hasLiked ? "#FF0000" : "#666"} 
            />
            <Text style={styles.actionText}>{item.likeCount || 0} Likes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Haven</Text>
        <View style={styles.headerActions}>
          {Platform.OS === 'web' && (
            <TouchableOpacity 
              onPress={onRefresh}
              style={styles.reloadButton}
              disabled={refreshing}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons 
                  name={refreshing ? "refresh" : "refresh-outline"} 
                  size={28} 
                  color="#000"
                />
              </Animated.View>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
            <Ionicons name="notifications-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          Platform.OS !== 'web' ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
          </View>
        }
      />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  reloadButton: {
    padding: 5,
  },
  listContent: {
    paddingVertical: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  postImage: {
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
  },
  postContent: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
