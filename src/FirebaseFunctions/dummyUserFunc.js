import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const createDummyUsers = async () => {
  const dummyUsers = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      password: 'password123',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1987654321',
      password: 'password123',
    },
    {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      phone: '+1122334455',
    },
    {
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      password: 'password123',
      phone: '+1555666777',
    },
    {
      name: 'Mike Brown',
      email: 'mike@example.com',
      password: 'password123',
      phone: '+1888999000',
    },
  ];

  const avatarUrl = 'https://firebasestorage.googleapis.com/v0/b/gram-4a58a.appspot.com/o/users%2FzXA6p8v0KkTGBa0qjo9lsWFiA5l1%2Favatar.jpg?alt=media&token=1a4d0e8d-17e0-43b7-9749-ea468bd20812';

  try {
    for (const userData of dummyUsers) {
      try {
        // Create auth user
        const userCredential = await auth().createUserWithEmailAndPassword(
          userData.email,
          userData.password
        );

        const { uid, email } = userCredential.user;

        // Create user document in Firestore
        await firestore()
          .collection('users')
          .doc(uid)
          .set({
            uid,
            name: userData.name,
            email,
            phone: userData.phone,
            avatar: avatarUrl,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp()
          });

        console.log(`Created user: ${userData.name}`);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`User ${userData.email} already exists, skipping...`);
        } else {
          console.error(`Error creating user ${userData.name}:`, error);
        }
      }
    }

    console.log('Dummy user creation completed');
  } catch (error) {
    console.error('Error in createDummyUsers:', error);
  }
};