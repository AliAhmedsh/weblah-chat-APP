import { View, Text, TouchableOpacity, FlatList, Image, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { clearState } from '../../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import styles from './Style';

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { user } = useSelector((state) => state?.userReducer);
  
  const processRealtimeData = async (snapshot) => {
    if (snapshot.exists()) {
      const chatRooms = snapshot.val();
      const processedKeys = new Set();

      const userChats = await Promise.all(
        Object.keys(chatRooms).map(async (key) => {
          const [uid1, uid2] = key.split('_');
          const relevantUid = uid1 === user.uid ? uid2 : uid1;

          if (uid1 === user.uid || uid2 === user.uid) {
            if (processedKeys.has(relevantUid)) return null;

            const messages = chatRooms[key];
            const messageArray = Object.values(messages).filter((message) => {
              // Filter out messages that should be hidden
              return message.text && message.timestamp && message.senderUID;
            });
            
            if (messageArray.length === 0) return null;
            
            messageArray.sort((a, b) => b.timestamp - a.timestamp);
            processedKeys.add(relevantUid);

            const latestMessage = messageArray[0];
            const lastMessage = latestMessage?.text || 'Media message';
            const messageTime = latestMessage?.timestamp || Date.now();
            const isReadStatus = latestMessage?.senderUID === user?.uid ? 
              true : (latestMessage?.isRead || false);

            // Get user data
            const userDocSnapshot = await firestore()
              .collection('users')
              .doc(relevantUid)
              .get();
              
            const userData = userDocSnapshot.exists ? userDocSnapshot.data() : {};
            const userName = userData.firstName || userData.name || userData.nickName || 'User';
            
            return {
              id: key,
              uid: relevantUid,
              name: userName,
              email: lastMessage,
              avatar: userData?.avatarImage || userData?.avatar || 'https://i.pravatar.cc/150?img=3',
              isRead: isReadStatus,
              messageTime,
              unReadFor: latestMessage?.unReadFor,
            };
          }
          return null;
        })
      );
      
      const filteredChats = userChats.filter(chat => chat !== null);
      filteredChats.sort((a, b) => (b.messageTime || 0) - (a.messageTime || 0));
      setChats(filteredChats);
    } else {
      setChats([]);
    }
    setLoading(false);
  };

  // Search all users in Firestore
  const searchAllUsers = async (query) => {
    if (!query) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('uid', '!=', user?.uid)
        .get();

      const results = [];
      const queryLower = query.toLowerCase();

      snapshot.forEach(doc => {
        const userData = doc.data();
        if (
          (userData.phone && userData.phone.includes(query)) ||
          (userData.firstName && userData.firstName.toLowerCase().includes(queryLower)) ||
          (userData.name && userData.name.toLowerCase().includes(queryLower)) ||
          (userData.nickName && userData.nickName.toLowerCase().includes(queryLower)) )
        {
          results.push({
            id: doc.id,
            uid: userData.uid,
            name: userData.firstName || userData.name || 'User',
            email: userData.email || '',
            avatar: userData?.avatarImage || userData?.avatar || 'https://i.pravatar.cc/150?img=3',
            isNew: true
          });
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const chatRef = database().ref('/chatRooms');
    const chatListener = chatRef.on('value', processRealtimeData);

    return () => {
      chatRef.off('value', chatListener);
    };
  }, [user?.uid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchAllUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    dispatch(clearState());
  };

  const renderUserItem = ({ item }) => {
    if (!item || !item.uid) return null;
    
    return (
      <TouchableOpacity 
        style={[styles.chatItem, !item.isRead && styles.unreadItem]}
        onPress={() => navigation.navigate('Chat', { 
          userId: item.uid, 
          userName: item.name,
          userAvatar: item.avatar,
          chatId: item.id || `${user.uid}_${item.uid}`
        })}
      >
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar} 
        />
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.name}</Text>
            {item.messageTime && (
              <Text style={styles.chatTime}>
                {new Date(item.messageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>
          <View style={styles.chatFooter}>
            <Text 
              style={[styles.chatMessage, !item.isRead && styles.unreadMessage]} 
              numberOfLines={1}
            >
              {item.email}
            </Text>
            {!item.isRead && item.unReadFor === user.uid && (
              <View style={styles.unreadBadge} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const dataToShow = searchQuery ? searchResults : chats;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {(searchQuery.length > 0 || searching) && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {searching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#075E54" />
        </View>
      ) : (
        <FlatList
          data={dataToShow}
          renderItem={renderUserItem}
          keyExtractor={item => item?.uid || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No matching results found' : 'No chats available'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Home;