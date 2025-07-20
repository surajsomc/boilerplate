import * as React from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

function BotBubble({ message }: MessageBubbleProps) {
  return (
    <View className='bg-muted p-3 rounded-xl mb-2 self-start max-w-[80%]'>
      <Text className='text-muted-foreground'>{message.text}</Text>
    </View>
  );
}

function UserBubble({ message }: MessageBubbleProps) {
  return (
    <View className='bg-primary p-3 rounded-xl mb-2 self-end max-w-[80%]'>
      <Text className='text-primary-foreground'>{message.text}</Text>
    </View>
  );
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
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState('');
  const flatListRef = React.useRef<FlatList<Message>>(null);

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

  const scrollToBottom = React.useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const renderMessage = React.useCallback(({ item }: { item: Message }) => {
    return item.from === 'user' ? (
      <UserBubble message={item} />
    ) : (
      <BotBubble message={item} />
    );
  }, []);

  const keyExtractor = React.useCallback((item: Message) => item.id, []);

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-background'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View className='flex-1 p-4'>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Chat messages"
        />
      </View>
      
      <View className='flex-row items-center p-3 border-t border-border bg-background'>
        <TextInput
          className='flex-1 rounded-lg border border-border px-3 py-2 text-base text-foreground bg-card mr-2'
          placeholder='Type a message...'
          placeholderTextColor='#888'
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType='send'
          multiline={false}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message here"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className='bg-primary rounded-lg px-4 py-2 active:opacity-80'
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityHint="Tap to send your message"
        >
          <Text className='text-primary-foreground font-medium'>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
} 