import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';

class FirstScreenLoader extends Component {

  state = {
    alreadyCalled: false
  }

  //Checks if a user has been logged in. If a user has, it navigates the correct screen depending if they
  //are a student or a teacher
  async componentDidMount() {

    await FirebaseFunctions.auth.onAuthStateChanged(async (user) => {
      if (this.state.alreadyCalled === false) {
        this.setState({ alreadyCalled: true });
        if (!user) {
          this.props.navigation.push("LoginScreen");
          return;
        }
        //Makes sure this user is subscribed to a topic
        FirebaseFunctions.fcm.subscribeToTopic(user.uid);
        const student = await FirebaseFunctions.getStudentByID(user.uid);
        if (student !== -1) {
          this.props.navigation.push("StudentCurrentClass", {
            userID: user.uid,
          });
          return;
        }
        this.props.navigation.push("TeacherCurrentClass", {
          userID: user.uid,
        });
        return;
      }

    });

  }

  // Placeholder loading in case async fetch takes too long
  render() {
    return (
      <QCView style={screenStyle.container}>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <StatusBar barStyle="default" />
        </View>
      </QCView>
    );
  }
}

export default FirstScreenLoader;