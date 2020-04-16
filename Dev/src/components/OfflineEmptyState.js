import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import QcActionButton from 'components/QcActionButton';
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";
import strings from 'config/strings';

const OfflineEmptyState = props => {
  return (
    <View
      style={{
        flex: 2,
        marginTop: screenHeight * 1/4,
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "center"
      }}
    >
          <Text style={[fontStyles.bigTextStyleDarkestGrey, {textAlign: "center"}]}>{strings.Offline}</Text>

      <Image
        source={require("assets/emptyStateIdeas/boy-offline.png")}
        style={{
          width: 0.73 * screenWidth,
          height: 0.22 * screenHeight,
          resizeMode: "contain",
          marginTop: 30,
        }}
      />


      <Text style={[fontStyles.mainTextStyleDarkGrey, {textAlign: "center", marginVertical: 10}]}>
        {strings.OfflineDesc}
      </Text>

      <QcActionButton
        text={strings.Retry}
        onPress={props.retry}
      />
    </View>
  );
};

export default OfflineEmptyState;
