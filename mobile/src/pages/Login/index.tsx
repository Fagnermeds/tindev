import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import { NavigationSwitchProp } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';
import styles from './styles';

interface INavigationProps {
  navigation: NavigationSwitchProp<any>;
}

interface ILoginProps extends INavigationProps{};

const Login: React.FC<ILoginProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
       if (user) {
         navigation.navigate('Main', { user });
       }
    })
  }, []);

  const handleSubmit = useCallback(async () => {
    const response = await api.post('/devs', { username });

    const { _id } = response.data;

    await AsyncStorage.setItem('user', _id);
    
    navigation.navigate('Main', { user: _id });

  }, [username]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior="padding"
      enabled={Platform.OS === 'ios'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image source={require("../../assets/logo.png")}/>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input} 
            placeholder="Digite seu username do github"
            placeholderTextColor= "#666360"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            onPress={handleSubmit} 
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.textButton}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Login;