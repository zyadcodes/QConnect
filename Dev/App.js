import React, { Component } from 'react';
import MainStackNavigator from './src/screens/MainStackNavigator';
import { YellowBox } from 'react-native';

export default class App extends Component {

  render() {
    YellowBox.ignoreWarnings(['componentWillUpdate', 'componentWillMount', 'componentWillReceiveProps']);
    return (
      <MainStackNavigator />
    );
  }

}


