import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { clearState } from '../../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import styles from './Style';

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state?.userReducer)
  

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('uid', '!=', user?.uid) 
      .onSnapshot(querySnapshot => {
        const usersData = [];
        querySnapshot.forEach(documentSnapshot => {
          usersData.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data()
          });
        });
        setUsers(usersData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      (user.phone && user.phone.includes(query)) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleLogout = () => {
    dispatch(clearState());
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { 
        userId: item.uid, 
        userName: item.name,
        userAvatar: item.avatar
      })}
    >
      <Image 
        source={{ uri: item.avatar || 'https://i.pravatar.cc/150?img=3' }} 
        style={styles.avatar} 
      />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          {/* You can add last seen or other info here */}
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.chatMessage} numberOfLines={1}>{item.email}</Text>
          {/* You can add status indicators here */}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, phone or email"
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

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.uid}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matching users found' : 'No users available'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Home;