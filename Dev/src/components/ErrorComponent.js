/* eslint-disable quotes */
import React, { useState, useEffect } from "react";

import {
  TouchableOpacity,
  Text,
  Image,
  Alert,
  View,
  Share,
} from "react-native";
import colors from "config/colors";
import strings from "config/strings";
import fontStyles from "config/fontStyles";
import { sendEmail } from "utils/send-email";
import { screenHeight, screenWidth } from "config/dimensions";

//props: retry(), error
const ErrorComponent = props => {
  return (
    <View
      style={{
        flex: 2,
        backgroundColor: colors.lightGreen,
        paddingVertical: (screenHeight * 1) / 6,
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "center"
      }}
    >
      <Text style={[fontStyles.hugeTextStyleWhite, { textAlign: "center" }]}>
        {strings.SomethingWentWrong}
      </Text>
      <Text
        style={[
          fontStyles.bigTextStyleWhite,
          { textAlign: "center", marginVertical: 20 }
        ]}
      >
        {strings.WeAreWorkingOnIt}
      </Text>
      <Text
        style={[
          fontStyles.bigTextStyleWhite,
          { textAlign: "center", marginVertical: 5 }
        ]}
      >
        Error: {props.error}
      </Text>
      <View
        style={{
          flexDirection: "row",
          height: 80,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={() => props.retry()}>
          <Image
            source={require("assets/emptyStateIdeas/try-again.png")}
            style={{
              height: 80,
              paddingRight: 40,
              resizeMode: "contain"
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            let errBody = `\n\nError details for support: ${JSON.stringify(
              props.error
            )}`;

            sendEmail("quranconnect@outlook.com", "FATAL_ERROR_REPORT", errBody)
              .then(() => {
                Alert.alert(strings.InfoSentTitle, strings.InfoSentToSupport);
              })
              .catch(err => {
                //if we fail to send via email, fallback to sending it through share flyout.
                Share.share({
                  title: strings.BugReport,
                  subject: strings.BugReport,
                  message: strings.SendBugToSupport + ".\n " + errBody,
                });
              });
          }}
        >
          <Image
            source={require("assets/emptyStateIdeas/contact-us.png")}
            style={{
              height: 80,
              resizeMode: "contain"
            }}
          />
        </TouchableOpacity>
      </View>
      <Image
        source={require("assets/emptyStateIdeas/error.png")}
        style={{
          height: screenHeight / 2,
          paddingBottom: 100,
          resizeMode: "contain"
        }}
      />
    </View>
  );
};

export default ErrorComponent;
