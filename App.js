import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, Modal, Dimensions } from 'react-native';
import * as Linking from 'expo-linking';
import WebView from 'react-native-webview';

export default function App() {
  const [userData, setUserData] = useState(null);
  const [showWebView, setShowWebView] = useState(false);
  const webViewRef = useRef(null);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Received message:', data);

      if (data.status === 'auth/success') {
        setUserData(data.data);
        setShowWebView(false);
        Alert.alert('Success', 'Successfully logged in with Telegram!');
      } else if (data.status === 'auth/error') {
        setShowWebView(false);
        Alert.alert('Error', data.message || 'Authentication failed');
      } else if (data.status === 'auth/cancel') {
        setShowWebView(false);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      setShowWebView(false);
      Alert.alert('Error', 'Failed to process authentication');
    }
  };

  const openTelegramAuth = () => {
    setShowWebView(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userData ? (
        <View style={{ alignItems: 'center' }}>
          <Text>Welcome, {userData.first_name}!</Text>
          <Text>Username: {userData.username}</Text>
        </View>
      ) : (
        <Text onPress={openTelegramAuth} style={{ padding: 20, color: 'blue' }}>
          Login with Telegram
        </Text>
      )}

      <Modal
        visible={showWebView}
        onRequestClose={() => setShowWebView(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://mini-app-network.vercel.app/' }}
            onMessage={handleMessage}
            style={{ flex: 1 }}
            incognito={true}
            cacheEnabled={false}
          />
        </View>
      </Modal>
    </View>
  );
}
