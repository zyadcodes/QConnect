import React, { Component } from "react";
import { Linking, View, Text, Share, Image, Clipboard } from "react-native";
import { screenHeight, screenWidth } from "config/dimensions";
import fontStyles from "config/fontStyles";
import { Icon } from "react-native-elements";
import colors from "config/colors";
import strings from "config/strings";
import Toast, { DURATION } from "react-native-easy-toast";
import themeStyles from "config/themeStyles";

export default class QCWebView extends Component {
  render() {
    const { uri } = this.props;
    if (!uri || uri.length === 0) {
      return <View />;
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={[fontStyles.bigTextStylePrimaryDark, { marginBottom: 15 }]}
        >
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
        <Image
          style={{
            width: screenWidth * 0.7,
            height: screenHeight * 0.25,
            resizeMode: "contain",
            resizeMethod: "scale",
            marginVertical: 10,
          }}
          source={require("assets/images/online-meeting.png")}
        />
        <Text
          style={[fontStyles.mainTextStylePrimaryDark, { padding: 5 }]}
          onPress={() => Linking.openURL(uri)}
        >
          {uri}
        </Text>
        <Toast position={"center"} ref="toast" style={themeStyles.toastStyle} />
        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
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

          <Icon
            name="content-copy"
            size={18}
            raised
            type="material-community"
            color={colors.primaryDark}
            onPress={() => {
              Clipboard.setString(uri);
              this.refs.toast.show(
                strings.MeetingLinkCopiedToClipboard,
                DURATION.LENGTH_SHORT
              );
            }}
          />
        </View>
      </View>
    );
  }
}
