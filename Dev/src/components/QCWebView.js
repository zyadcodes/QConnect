import React, { Component } from "react";
import { Linking, View } from "react-native";
import { WebView } from "react-native-webview";

export default class QCWebView extends Component {
  render() {
    const { uri } = this.props;
    if (uri === undefined || uri.length === 0) {
      return <View />;
    }
    return (
      <WebView
        ref={ref => {
          this.webview = ref;
        }}
        source={{ uri }}
        onNavigationStateChange={event => {
          if (event.url !== uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }
}
