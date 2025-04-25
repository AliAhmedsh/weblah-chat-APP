import {StyleSheet} from 'react-native';
import Responsive from '../../libs/responsive';
const {getHeight, getWidth, AppFonts} = Responsive;

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
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getWidth(3),
    paddingVertical: getHeight(1.5),
    backgroundColor: '#075E54',
    paddingTop: getHeight(2.5),
    minHeight: getHeight(7),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: getHeight(0.1)},
    shadowOpacity: 0.2,
    shadowRadius: getWidth(0.5),
  },
  backButton: {
    padding: getWidth(1.5),
    marginRight: getWidth(1),
  },
  headerInfoContainer: {
    flex: 1,
    marginLeft: getWidth(4),
    marginRight: getWidth(3),
  },
  headerTitle: {
    fontSize: AppFonts.t1,
    fontWeight: '600',
    color: 'white',
    marginBottom: getHeight(0.3),
  },
  headerSubtitle: {
    fontSize: AppFonts.t4,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: getWidth(30),
    justifyContent: 'flex-end',
  },
  headerIcon: {
    marginLeft: getWidth(5),
  },
  inputToolbarContainer: {
    backgroundColor: '#f0f0f0',
    borderTopWidth: 0,
    paddingHorizontal: getWidth(2),
    paddingBottom: getHeight(0.6),
    paddingTop: getHeight(1),
  },
  inputPrimary: {
    alignItems: 'center',
  },
  accessoryStyle: {
    height: getHeight(5.5),
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: getWidth(5),
    paddingHorizontal: getWidth(4),
    paddingVertical: getHeight(0.8),
    fontSize: AppFonts.t2,
    marginLeft: getWidth(1.5),
    marginRight: getWidth(1.5),
    flex: 1,
    maxHeight: getHeight(12),
    minHeight: getHeight(4.5),
    color: 'black',
    borderWidth: getWidth(0.3),
    borderColor: '#e5e5e5',
    textAlignVertical: 'center',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getWidth(1.5),
    marginBottom: getHeight(0.6),
  },
  sendButton: {
    width: getWidth(10),
    height: getHeight(5),
    borderRadius: getWidth(5),
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollToBottom: {
    backgroundColor: 'white',
    borderRadius: getWidth(4),
    padding: getWidth(1.5),
    marginBottom: getHeight(1.5),
  },
  messageContainer: {
    flexDirection: 'row',
    paddingHorizontal: getWidth(3),
    paddingVertical: getHeight(0.6),
  },
  messageBubble: {
    borderRadius: getWidth(4),
    paddingHorizontal: getWidth(4),
    paddingVertical: getHeight(1.5),
    maxWidth: getWidth(80),
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
    fontSize: AppFonts.t2,
  },
  timeText: {
    fontSize: AppFonts.t5,
    color: '#667781',
    marginTop: getHeight(0.6),
    alignSelf: 'flex-end',
  },
  messageImage: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: getWidth(60),
    borderRadius: getWidth(2),
    backgroundColor: '#f0f0f0',
  },
  uploadIndicator: {
    marginLeft: getWidth(3),
    paddingHorizontal: getWidth(1.5),
  },
});

export default styles;
