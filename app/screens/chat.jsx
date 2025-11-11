import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const conversationId = params.id;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const userId = auth.currentUser?.uid;
  const flatListRef = useRef(null);

  // Load conversation and messages
  useEffect(() => {
    if (!conversationId || !userId) {
      setLoading(false);
      return;
    }

    // Load conversation data
    const conversationRef = doc(db, 'conversations', conversationId);
    const unsubscribeConversation = onSnapshot(conversationRef, (snapshot) => {
      if (snapshot.exists()) {
        setConversation({ id: snapshot.id, ...snapshot.data() });
      }
    });

    // Load messages
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
      }));
      setMessages(messagesData);
      setLoading(false);
      
      // Scroll to bottom when new messages arrive
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      unsubscribeConversation();
      unsubscribeMessages();
    };
  }, [conversationId, userId]);

  // Create or get conversation
  const getOrCreateConversation = async () => {
    if (conversationId) {
      return conversationId;
    }

    if (!userId) return null;

    // Create new conversation
    const newConversation = {
      userId,
      recipientName: 'Child Protection Services',
      recipientId: 'child-protection-services',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=childprotection&size=60',
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const conversationRef = await addDoc(collection(db, 'conversations'), newConversation);
    return conversationRef.id;
  };

  // Create case study for conversation
  const createCaseStudy = async (convId) => {
    if (!userId || !convId) return null;

    try {
      // Check if case study already exists
      const snapshot = await getDoc(doc(db, 'caseStudies', convId));
      
      if (snapshot.exists()) {
        return snapshot.id;
      }

      // Create new case study
      // Note: serverTimestamp() cannot be used inside arrays, so we use Timestamp.now() for milestone dates
      const now = Timestamp.now();
      const caseStudyData = {
        userId,
        conversationId: convId,
        title: `Case #${convId.substring(0, 8).toUpperCase()}`,
        status: 'In Progress',
        progress: 10, // Initial progress
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        milestones: [
          { name: 'Initial Contact', completed: true, date: now },
          { name: 'Information Gathering', completed: false },
          { name: 'Case Review', completed: false },
          { name: 'Action Plan', completed: false },
          { name: 'Resolution', completed: false }
        ]
      };

      const caseStudyRef = await setDoc(doc(db, 'caseStudies', convId), caseStudyData);
      
      // Update conversation with case study ID
      await updateDoc(doc(db, 'conversations', convId), {
        caseStudyId: convId
      });

      return convId;
    } catch (error) {
      console.error('Error creating case study:', error);
      return null;
    }
  };

  // Update case progress based on message count
  const updateCaseProgress = async (convId, messageCount) => {
    if (!convId) return;

    try {
      const caseStudyRef = doc(db, 'caseStudies', convId);
      const caseStudyDoc = await getDoc(caseStudyRef);
      
      if (!caseStudyDoc.exists()) return;

      const caseStudy = caseStudyDoc.data();
      let progress = 10;
      const milestones = caseStudy.milestones || [];

      // Update progress based on message count and milestones
      // Note: serverTimestamp() cannot be used inside arrays, so we use Timestamp.now() for milestone dates
      const now = Timestamp.now();
      if (messageCount >= 5) {
        progress = 30;
        if (milestones[1] && !milestones[1].completed) {
          milestones[1].completed = true;
          milestones[1].date = now;
        }
      }
      if (messageCount >= 10) {
        progress = 50;
        if (milestones[2] && !milestones[2].completed) {
          milestones[2].completed = true;
          milestones[2].date = now;
        }
      }
      if (messageCount >= 15) {
        progress = 70;
        if (milestones[3] && !milestones[3].completed) {
          milestones[3].completed = true;
          milestones[3].date = now;
        }
      }
      if (messageCount >= 20) {
        progress = 90;
        if (milestones[4] && !milestones[4].completed) {
          milestones[4].completed = true;
          milestones[4].date = now;
        }
      }

      await updateDoc(caseStudyRef, {
        progress,
        milestones,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating case progress:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    let convId = conversationId;
    
    // Create conversation if it doesn't exist
    if (!convId) {
      convId = await getOrCreateConversation();
      if (!convId) return;
      
      // Update URL to include conversation ID
      router.replace(`/screens/chat?id=${convId}&name=${params.name || 'Child Protection Services'}`);
    }

    try {
      // Create case study on first message
      if (messages.length === 0) {
        await createCaseStudy(convId);
      }

      // Save message to Firebase
      const messagesRef = collection(db, 'conversations', convId, 'messages');
      await addDoc(messagesRef, {
        text: message.trim(),
        sender: 'user',
        userId,
        createdAt: serverTimestamp(),
      });

      // Update conversation with last message
      const conversationRef = doc(db, 'conversations', convId);
      await updateDoc(conversationRef, {
        lastMessage: message.trim().substring(0, 50) + (message.trim().length > 50 ? '...' : ''),
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update case progress
      await updateCaseProgress(convId, messages.length + 1);

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const time = item.createdAt 
      ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : item.time || '';

    return (
      <View style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        {time && <Text style={styles.messageTime}>{time}</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{params.name || 'Chat'}</Text>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Loading messages...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
            </View>
          )
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type something here.."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={28} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesList: {
    padding: 20,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#F4C430',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#F4C430',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});

