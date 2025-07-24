import * as React from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text as RNText,
  Dimensions,
  Image,
} from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';

const BOT_BG = 'rgba(243,244,246,0.95)';
const USER_BG = '#6366f1';
const BOT_TEXT = '#18181b';
const USER_TEXT = '#fff';
const NAV_BG = 'rgba(24,24,27,0.95)';
const BORDER = '#27272a';
const PADDING_BOTTOM = 120; // More space above navbar
const PADDING_TOP = 56; // More space at top
const AVATAR_SIZE = 32;
const BOT_AVATAR = 'https://randomuser.me/api/portraits/men/1.jpg';
const USER_AVATAR = 'https://randomuser.me/api/portraits/men/32.jpg';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    from: 'bot',
    text: 'Hi! I am your assistant. How can I help you today?',
    timestamp: new Date(),
  },
];

export default function ChatScreen() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState('');
  const flatListRef = React.useRef<FlatList<Message>>(null);

  function BotBubble({ message }: { message: Message }) {
    return (
      <View style={styles.bubbleRow}>
        <Image source={{ uri: BOT_AVATAR }} style={[styles.avatar, { backgroundColor: colorScheme === 'dark' ? '#27272a' : '#e5e7eb' }]} />
        <View style={[styles.botBubble, { backgroundColor: colorScheme === 'dark' ? 'rgba(243,244,246,0.08)' : 'rgba(243,244,246,0.95)' }] }>
          <RNText style={[styles.botText, { color: theme.text }]}>{message.text}</RNText>
        </View>
      </View>
    );
  }

  function UserBubble({ message }: { message: Message }) {
    return (
      <View style={[styles.bubbleRow, { justifyContent: 'flex-end' }] }>
        <View style={[styles.userBubble, { backgroundColor: colorScheme === 'dark' ? theme.primary : '#6366f1' }] }>
          <RNText style={[styles.userText, { color: colorScheme === 'dark' ? theme.background : '#fff' }]}>{message.text}</RNText>
        </View>
        <Image source={{ uri: USER_AVATAR }} style={[styles.avatar, { backgroundColor: colorScheme === 'dark' ? '#27272a' : '#e5e7eb' }]} />
      </View>
    );
  }

  const sendMessage = React.useCallback(() => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      from: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: "I'm just a demo bot, but I'm here to chat!",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 700);
  }, [input]);

  React.useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = React.useCallback(({ item }: { item: Message }) => {
    return item.from === 'user' ? (
      <UserBubble message={item} />
    ) : (
      <BotBubble message={item} />
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.flex, { marginTop: 88 }]}> {/* Add margin to avoid overlap with TopBar */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.inputBarWrap} pointerEvents="box-none">
        <View style={[styles.inputBar, { backgroundColor: colorScheme === 'dark' ? 'rgba(24,24,27,0.95)' : 'rgba(255,255,255,0.95)', borderColor: theme.border }] }>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colorScheme === 'dark' ? '#a1a1aa' : '#71717a'}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendButton, { backgroundColor: colorScheme === 'dark' ? theme.primary : '#6366f1' }]}
            accessibilityRole="button"
          >
            <RNText style={[styles.sendButtonText, { color: colorScheme === 'dark' ? theme.background : '#fff' }]}>Send</RNText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: 'transparent' },
  messagesContainer: {
    paddingTop: PADDING_TOP + 56,
    paddingHorizontal: 16,
    paddingBottom: PADDING_BOTTOM,
    minHeight: Dimensions.get('window').height * 0.7,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 6,
    marginBottom: 2,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: BOT_BG,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    maxWidth: '80%',
    borderTopLeftRadius: 4,
    marginLeft: 2,
    marginRight: 32,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: USER_BG,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    maxWidth: '80%',
    borderTopRightRadius: 4,
    marginRight: 2,
    marginLeft: 32,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  botText: {
    color: BOT_TEXT,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  userText: {
    color: USER_TEXT,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  inputBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32 + 64 + 32, // nav bar height + margin + extra
    alignItems: 'center',
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NAV_BG,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: BORDER,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  topBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 36,
    alignItems: 'center',
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NAV_BG,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 40,
    marginHorizontal: 32,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: BORDER,
  },
  menuBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#27272a',
  },
  toggleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#27272a',
  },
}); 