import React from "react";
import { View, Text, Image } from "react-native";
import QcActionButton from "components/QcActionButton";
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import strings from "config/strings";
import { TouchableOpacity } from "react-native-gesture-handler";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log("hereee...");
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("cdc: ....");
    // You can also log the error to an error reporting service
    this.logErrorToMyService(error, errorInfo);
  }

  logErrorToMyService(error, errorInfo) {
    console.log(JSON.stringify(error.toString()), JSON.stringify(errorInfo));
  }

  render() {
    console.log("render error:");
    if (this.state.hasError) {
      console.log("in error state component part");
      // You can render any custom fallback UI
      return (
        <View
          style={{
            flex: 2,
            backgroundColor: "#90cdbd",
            paddingVertical: (screenHeight * 1) / 6,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'center'
          }}
        >
          <Text
            style={[fontStyles.hugeTextStyleWhite, { textAlign: 'center' }]}
          >
            {strings.SomethingWentWrong}
          </Text>
          <Text
            style={[
              fontStyles.bigTextStyleWhite,
              { textAlign: 'center', marginVertical: 20 },
            ]}
          >
            {strings.WeAreWorkingOnIt}
          </Text>
          <View style={{ flexDirection: 'row', height: 80 }}>
            <TouchableOpacity>
              <Image
                source={require('assets/emptyStateIdeas/try-again.png')}
                style={{
                  width: 60,
                  height: 80,
                  paddingHorizontal: 40,
                  resizeMode: 'contain'
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('assets/emptyStateIdeas/go-home.png')}
                style={{
                  width: 60,
                  height: 80,
                  paddingHorizontal: 40,
                  resizeMode: 'contain'
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('assets/emptyStateIdeas/contact-us.png')}
                style={{
                  width: 60,
                  height: 80,
                  paddingHorizontal: 40,
                  resizeMode: 'contain'
                }}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={require('assets/emptyStateIdeas/error.png')}
            style={{
              height: screenHeight / 2,
              paddingBottom: 100,
              resizeMode: "contain"
            }}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
