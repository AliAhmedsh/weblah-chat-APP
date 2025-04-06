import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#075E54',
      },
      container: {
        flex: 1,
        backgroundColor: '#e5ddd5',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5ddd5',
      },
      chatList: {
        backgroundColor: '#e5ddd5',
      },
      // Header Styles
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: '#075E54',
        paddingTop: Platform.OS === 'ios' ? 10 : 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      backButton: {
        padding: 5,
      },
      headerInfoContainer: {
        flex: 1,
        marginLeft: 15,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 2,
      },
      headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
      },
      headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      headerIcon: {
        marginLeft: 20,
      },
      // Input Toolbar Styles
      inputToolbarContainer: {
        backgroundColor: '#f0f0f0',
        borderTopWidth: 0,
        paddingHorizontal: 8,
        paddingBottom: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: 8,
        marginBottom: Platform.OS === 'ios' ? 5 : 0,
      },
      inputPrimary: {
        alignItems: 'center',
      },
      accessoryStyle: {
        height: 44,
      },
      textInput: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 8 : 6,
        fontSize: 16,
        marginLeft: 5,
        marginRight: 5,
        flex: 1,
        maxHeight: 100,
        color: 'black',
        borderWidth: 1,
        borderColor: '#e5e5e5',
      },
      sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        marginBottom: 5,
      },
      sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#075E54',
        justifyContent: 'center',
        alignItems: 'center',
      },
      scrollToBottom: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5,
        marginBottom: 10,
      },
      // Message styles
      messageContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
      },
      messageBubble: {
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxWidth: '80%',
      },
      leftBubble: {
        backgroundColor: 'white',
        borderTopLeftRadius: 0,
      },
      rightBubble: {
        backgroundColor: '#DCF8C6',
        borderTopRightRadius: 0,
      },
      messageText: {
        fontSize: 16,
      },
      timeText: {
        fontSize: 12,
        color: '#667781',
        marginTop: 5,
        alignSelf: 'flex-end',
      },
    
});

export default styles;