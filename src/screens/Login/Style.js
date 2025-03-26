import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
      },
      methodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
      },
      methodButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center'
      },
      activeMethod: {
        backgroundColor: '#4CAF50',
      },
      input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: 'white'
      },
      loginButton: {
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
      },
      loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
      },
      signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      signUpText: {
        marginRight: 5
      },
      signUpLink: {
        color: '#4CAF50',
        fontWeight: 'bold'
      }
})

export default styles