import React, { Component } from "react";
import MainStackNavigator from "./src/screens/MainStackNavigator";
import { YellowBox, Alert, ScrollView, View } from "react-native";
import NetInfo from '@react-native-community/netinfo';
import QCView from "components/QCView";
import screenStyle from "config/screenStyle";
import strings from 'config/strings';
import {
  checkNotifications,
  requestNotifications,
  check,
  request,
  PERMISSIONS,
} from "react-native-permissions";
import FirebaseFunctions from "config/FirebaseFunctions";
import OfflineEmptyState from "./src/components/OfflineEmptyState";

export default class App extends Component {
  state = {
    requestingPermissions: true,
    isOnline: true,
    retry: 0
  };

  // Subscribe
  unsubscribe = () => {};

  async componentWillUnmount() {
    this.unsubscribe();
    await FirebaseFunctions.auth.onAuthStateChanged(async user => {
      try {
          if (!user) {
            return;
          }
          //Makes sure this user is subscribed to a topic
          const student = await FirebaseFunctions.getStudentByID(user.uid);
          if (student !== -1) {
            FirebaseFunctions.setUserActiveState(student.ID, false, 'offline');
            return;
          }
          FirebaseFunctions.setUserActiveState(user.uid, true, 'offline');
          return;
      } catch (err) {
        console.log(JSON.stringify(err.toString()));
      }
    });
  }

  async componentDidMount() {
    const isPermissionsGranted = await checkNotifications();
    if (isPermissionsGranted !== "granted") {
      await requestNotifications(["alert", "sound", "badge"]);
      this.setState({ requestingPermissions: false });
    } else {
      this.setState({ requestingPermissions: false });
    }

    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({ isOnline: state.isConnected });
    });
  }

  //get called if device connectivity state changes (online/offline)
  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  async onRetry() {
    let nstate = await NetInfo.fetch();
    if (nstate.isConnected !== this.state.isConnected) {
      this.setState({ isConnected: nstate.isConnected });
    }
    //change a dummy state variable to force re-mount / retry
    this.setState({ retry: this.state.retry + 1 });
  }

  renderMainApp() {
    return (
      <ScrollView contentContainerStyle={{
        flex: 1,
    }}>
        {this.state.isOnline ? (
          this.state.requestingPermissions === false ? (
            <MainStackNavigator />
          ) : (
            <View />
          )
        ) : (
          <OfflineEmptyState retry={this.onRetry.bind(this)} />
        )}
      </ScrollView>
    );
  }
  render() {
    YellowBox.ignoreWarnings([
      "componentWillUpdate",
      "componentWillMount",
      "componentWillReceiveProps"
    ]);
    console.disableYellowBox = false;

    try {
      return this.renderMainApp();
    } catch (err) {
      if (this.state.online) {
        FirebaseFunctions.logEvent("FATAL_ERROR", { err });
      }
      console.log(JSON.stringify(err.toString()));
      Alert.alert(strings.Whoops, strings.SomethingWentWrong);
      return <QCView style={screenStyle.container} />;
    }
  }
}
