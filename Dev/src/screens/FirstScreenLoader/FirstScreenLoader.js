import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import OfflineEmptyState from "components/OfflineEmptyState";

class FirstScreenLoader extends Component {
  state = {
    alreadyCalled: false,
    showOfflineError: false,
    retry: 0
  };

  //Checks if a user has been logged in. If a user has, it navigates the correct screen depending if they
  //are a student or a teacher
  async componentDidMount() {
    let succeeded = await this.tryInitUser();
    if (!succeeded) {
      this.setState({ showOfflineError: true, alreadyCalled: false });
    }
  }

  async tryInitUser() {
    let ret = true;
    await FirebaseFunctions.auth.onAuthStateChanged(async user => {
      try {
        if (this.state.alreadyCalled === false) {
          console.log('retrying ....');
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
      } catch (err) {
        console.log(JSON.stringify(err.toString()))
        ret = false;
      }
    });
    return ret;
  }

  // async componentDidUpdate(){
  //   if (!this.state.alreadyCalled && this.state.showOfflineError) {
  //     let succeeded = await this.tryInitUser();
  //     if (succeeded) {
  //       this.setState({ showOfflineError: false });
  //     }
  //   }
  // }

  // Placeholder loading in case async fetch takes too long
  render() {
    setTimeout(() => {
      this.setState({ showOfflineError: true, alreadyCalled: false });
    }, 2000);

    if (this.state.showOfflineError) {
      return (
        <OfflineEmptyState
          retry={
            async () => {
              let succeeded = await this.tryInitUser();
              if (succeeded) {
                this.setState({ showOfflineError: false });
              }
            }
            // this.setState({
            //   showOfflineError: false,
            //   alreadyCalled: false,
            //   retry: this.state.retry + 1
            //
            //})
          }
        />
      );
    }
    return (
      <QCView style={screenStyle.container}>
        <View
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <ActivityIndicator />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <StatusBar barStyle="default" />
        </View>
      </QCView>
    );
  }
}

export default FirstScreenLoader;
