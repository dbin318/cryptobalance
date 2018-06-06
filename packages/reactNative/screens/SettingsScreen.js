import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';

export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    const { params } = this.props.navigation.state
    // const { name } = params // user's name

    return (
      <View style={styles.container}>
        <View style={styles.playContainer}>
          <Text
            onPress={this._handlePlayPress}
            style={styles.playLinkText}>
            게임하기
          </Text>
        </View>
        <View style={styles.resultContainer}>
          <Text
            onPress={this._handleResultPress}
            style={styles.resultLinkText}>
            결과보기
          </Text>
        </View>
      </View>
    )
  }

  _handlePlayPress = () => {
    this.props.navigation.navigate('Play', {})
  }

  _handleResultPress = () => {
    this.props.navigation.navigate('Result', {})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  playContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playLinkText: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultLinkText: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
  },
})
