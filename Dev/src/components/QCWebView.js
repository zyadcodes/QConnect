import React, { Component } from "react";
import { Linking, View, Text, Share } from "react-native";
import { WebView } from "react-native-webview";
import fontStyles from "config/fontStyles";
import { Icon } from "react-native-elements";
import colors from "config/colors";
import strings from "config/strings";

export default class QCWebView extends Component {
  render() {
    const { uri } = this.props;
    if (!uri || uri.length === 0) {
      return <View />;
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={fontStyles.bigTextStyleDarkGrey}>
          {strings.MeetingLink}
        </Text>
        <Text
          style={[
            fontStyles.mainTextStyleDarkGrey,
            {
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              textAlignVertical: "center",
            },
          ]}
        >
          {strings.MeetingLinkDesc}
        </Text>
        <Text
          style={[fontStyles.mainTextStylePrimaryDark, { padding: 10 }]}
          onPress={() => Linking.openURL(uri)}
        >
          {uri}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            name="share"
            size={18}
            raised
            type="material-community"
            color={colors.primaryDark}
            onPress={() =>
              Share.share({
                title: strings.ShareMeetingLink,
                subject: strings.MeetingLink,
                message: strings.MeetingLinkSharingMsg + uri,
              })
            }
          />
        </View>
      </View>
    );
  }
}
