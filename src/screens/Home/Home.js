import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import React from 'react';
import { clearState } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Demo chat data
  const chats = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you doing?',
      time: '10:30 AM',
      unread: 2,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      name: 'Sarah Smith',
      lastMessage: 'Meeting at 3 PM tomorrow',
      time: '9:45 AM',
      unread: 0,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      name: 'Work Group',
      lastMessage: 'Mike: I sent the files',
      time: 'Yesterday',
      unread: 5,
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: '4',
      name: 'Mom',
      lastMessage: 'Call me when you get home',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    {
      id: '5',
      name: 'David Wilson',
      lastMessage: 'Thanks for your help!',
      time: '7/20/23',
      unread: 0,
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
  ];

  const handleLogout = () => {
    dispatch(clearState());
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.chatMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#075E54',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#128C7E',
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 12,
    color: '#888',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Home;