import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export default function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Set up deep link handler
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check for initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = (event) => {
    try {
      const url = event.url || event;
      console.log('Handling deep link:', url);

      const { path, queryParams } = Linking.parse(url);

      if (path === 'auth-callback') {
        if (!queryParams.data) {
          Alert.alert('Error', 'No authentication data received');
          return;
        }

        const data = JSON.parse(decodeURIComponent(queryParams.data));
        console.log('Received data:', data);

        if (data.status === 'error') {
          Alert.alert('Error', data.message || 'Authentication failed');
          return;
        }

        if (data.status === 'success') {
          setUserData(data);
          Alert.alert('Success', 'Successfully logged in with Telegram!');
        }
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
      Alert.alert('Error', 'Failed to handle authentication');
    }
  };

  const openTelegramAuth = async () => {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        'https://mini-app-network.vercel.app/',
        'miniappnetwork://auth-callback',
        {
          showInRecents: true,
          preferEphemeralSession: true
        }
      );
      
      console.log('WebBrowser result:', result);
      
      if (result.type === 'cancel') {
        console.log('Auth session was canceled');
      }
    } catch (error) {
      console.error('Error opening auth session:', error);
      Alert.alert('Error', 'Failed to open authentication page');
    }
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
    </View>
  );
}
