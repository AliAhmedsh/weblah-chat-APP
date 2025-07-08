import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {clearState} from '../../redux/slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
  const {user} = useSelector(state => state?.userReducer);

  const processRealtimeData = async snapshot => {
    if (snapshot.exists()) {
      const chatRooms = snapshot.val();
      const processedKeys = new Set();

      const userChats = await Promise.all(
        Object.keys(chatRooms).map(async key => {
          const [uid1, uid2] = key.split('_');
          const relevantUid = uid1 === user.uid ? uid2 : uid1;

          if (uid1 === user.uid || uid2 === user.uid) {
            if (processedKeys.has(relevantUid)) return null;

            const messages = chatRooms[key];
            const messageArray = Object.values(messages).filter(message => {
              return message.text && message.timestamp && message.senderUID;
            });

            if (messageArray.length === 0) return null;

            messageArray.sort((a, b) => b.timestamp - a.timestamp);
            processedKeys.add(relevantUid);

            const latestMessage = messageArray[0];
            let lastMessage = latestMessage?.text || 'Media message';

            // Format message preview
            if (latestMessage?.imageUrl) {
              lastMessage = '📷 Photo';
            } else if (latestMessage?.voiceMessage) {
              lastMessage = '🎤 Voice message';
            }

            const messageTime = latestMessage?.timestamp || Date.now();
            const isReadStatus =
              latestMessage?.senderUID === user?.uid
                ? true
                : latestMessage?.isRead || false;

            // Get user data
            const userDocSnapshot = await firestore()
              .collection('users')
              .doc(relevantUid)
              .get();

            const userData = userDocSnapshot.exists
              ? userDocSnapshot.data()
              : {};
            const userName =
              userData.firstName ||
              userData.name ||
              userData.nickName ||
              'User';
            const userStatus =
              userData.status || 'Hey there! I am using WhatsApp';

            return {
              id: key,
              uid: relevantUid,
              name: userName,
              lastMessage: lastMessage,
              status: userStatus,
              avatar:
                userData?.avatarImage ||
                userData?.avatar ||
                'https://i.pravatar.cc/150?img=3',
              isRead: isReadStatus,
              messageTime,
              unreadCount: isReadStatus ? 0 : 1,
            };
          }
          return null;
        }),
      );

      const filteredChats = userChats.filter(chat => chat !== null);
      filteredChats.sort((a, b) => (b.messageTime || 0) - (a.messageTime || 0));
      setChats(filteredChats);
    } else {
      setChats([]);
    }
    setLoading(false);
  };

  const searchAllUsers = async query => {
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
          (userData.firstName &&
            userData.firstName.toLowerCase().includes(queryLower)) ||
          (userData.name && userData.name.toLowerCase().includes(queryLower)) ||
          (userData.nickName &&
            userData.nickName.toLowerCase().includes(queryLower))
        ) {
          results.push({
            id: doc.id,
            uid: userData.uid,
            name: userData.firstName || userData.name || 'User',
            status: userData.status || 'Hey there! I am using WhatsApp',
            avatar:
              userData?.avatarImage ||
              userData?.avatar ||
              'https://i.pravatar.cc/150?img=3',
            isNew: true,
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

  // const handleLogout = () => {
  //   Alert.alert('Weblah', 'Are you sure ?');
  //   return;
  //   dispatch(clearState());
  // };

  const handleLogout = () => {
    Alert.alert(
      'Weblah',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(clearState());
            // Optionally navigate to login screen or splash screen
            navigation.replace('Login'); // or navigation.navigate
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const renderUserItem = ({item}) => {
    if (!item || !item.uid) return null;

    return (
      <TouchableOpacity
        style={[styles.chatItem, !item.isRead && styles.unreadItem]}
        onPress={() =>
          navigation.navigate('Chat', {
            userId: item.uid,
            userName: item.name,
            userAvatar: item.avatar,
            chatId: item.id || `${user.uid}_${item.uid}`,
          })
        }>
        <View style={styles.avatarContainer}>
          <Image source={{uri: item.avatar}} style={styles.avatar} />
          {/* {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )} */}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.chatTime}>
              {new Date(item.messageTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text
              style={[styles.chatMessage, !item.isRead && styles.unreadMessage]}
              numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {!item.isRead && (
              <MaterialIcons name="done-all" size={16} color="#075E54" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          navigation.navigate('Chat', {
            userId: item.uid,
            userName: item.name,
            userAvatar: item.avatar,
            chatId: `${user.uid}_${item.uid}`,
          });
          setSearchQuery('');
        }}>
        <Image source={{uri: item.avatar}} style={styles.avatar} />
        <View style={styles.chatContent}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.chatStatus} numberOfLines={1}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const dataToShow = searchQuery ? searchResults : chats;
  const renderItem = searchQuery ? renderSearchItem : renderUserItem;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weblah</Text>
        <View style={styles.headerIcons}>
          {/* <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="camera-outline" size={24} color="white" />
          </TouchableOpacity> */}

          <TouchableOpacity onPress={handleLogout} style={styles.headerIcon}>
            <MaterialIcons name="logout" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SettingsScreen');
            }}
            style={styles.headerIcon}>
            <Ionicons name="cog" size={23} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
          <Ionicons name="chatbubbles" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View> */}

      <View style={styles.searchContainer}>
        <View style={styles.searchInner}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search or start new chat"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading || searching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#075E54" />
        </View>
      ) : (
        <FlatList
          data={dataToShow}
          renderItem={renderItem}
          keyExtractor={item => item?.uid || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'No matching results found'
                  : 'No chats available'}
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.newChatButton}>
        <Ionicons name="chatbox-ellipses" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
