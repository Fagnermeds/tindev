import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { NavigationSwitchProp } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

import api from '../../services/api';
import styles from './styles';

interface INavigationProps {
  navigation: NavigationSwitchProp<any>;
}

interface IMainProps extends INavigationProps{};

interface IDevProps {
  _id: string;
  name: string;
  user: string;
  bio: string;
  avatar: string;
}

const Main: React.FC<IMainProps> = ({ navigation }) => {
  const user = navigation.getParam('user');

  const [devs, setDevs] = useState<IDevProps[]>([]);
  const [matchDev, setMatchDev] = useState<IDevProps | null>({} as IDevProps);

  useEffect(() => {
    api.get('/devs', {
      headers: {
        user,
      }
    })
      .then(response => {
        setDevs(response.data);
      })
      .catch(error => console.log(error));
  }, [user]);

  useEffect(() => {
    const socket = io('http://192.168.1.9:3333', {
      query: { user }
    });

    socket.on('match', (dev: IDevProps) => {
      setMatchDev(dev);
    });
  }, [user]);

  const handleDislike = useCallback(async () => {
    const [dev, ...rest] = devs;
    
    await api.post(`/devs/${dev._id}/dislikes`, null, {
      headers: {
        user,
      }
    });
    
    setDevs(rest);
  }, [devs, user]);

  const handleLike = useCallback(async () => {
    const [dev, ...rest] = devs;

    await api.post(`/devs/${dev._id}/likes`, null, {
      headers: {
        user,
      }
    });
    
    setDevs(rest);
  }, [devs, user])

  const handleLogout = useCallback(async () => {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={require("../../assets/logo.png")} />
      </TouchableOpacity>
      <View style={styles.cardsContainer}>
        {devs.length === 0 ? (<Text style={styles.empty}>Acabou :(</Text>) : 
        (devs.map((dev, index) => (
          <View key={dev._id} style={[styles.card, { zIndex: devs.length - index }]}>
            <Image style={styles.avatar} source={{ uri: dev.avatar }} />
            <View style={styles.footer}> 
              <Text style={styles.name}>{dev.name ? dev.name : dev.user}</Text>
              <Text style={styles.bio} numberOfLines={3}>{dev.bio ? dev.bio : 'No description'}</Text>
            </View>
          </View>)
        ))}
      </View>
      {devs.length > 0 && (<View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.button}>
          <Image source={require('../../assets/like.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDislike} style={styles.button}>
          <Image source={require('../../assets/dislike.png')} />
        </TouchableOpacity>
      </View>)
      }

      { matchDev && (
        <View style={styles.matchContainer}> 
          <Image style={styles.matchImage} source={require('../../assets/itsamatch.png')} />
          <Image style={styles.matchAvatar} source={ { uri: matchDev.avatar } } />

          <Text style={styles.matchName}>{matchDev.name ? matchDev.name : matchDev.user}</Text>
          <Text style={styles.matchBio}>{matchDev.bio ? matchDev.bio : 'No description.'}</Text>
          <TouchableOpacity onPress={() => setMatchDev(null)} style={styles.matchButton}> 
            <Text style={styles.closeMatch}>Fechar</Text>
          </TouchableOpacity>
        </View>
      ) }
    </SafeAreaView>
  );
}

export default Main;
