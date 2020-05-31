import React from "react";
import { View, Text, Image } from "react-native";
import FirebaseFunctions from "config/FirebaseFunctions";
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
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  async componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    await this.logErrorToMyService(error, errorInfo);
  }

  async logErrorToMyService(error, errorInfo) {
    console.log(JSON.stringify(error.toString()), JSON.stringify(errorInfo));
    try {
      await FirebaseFunctions.logEvent("FATAL_ERROR_CATCH", {
        error,
        errorInfo,
      });
    } catch (err) {
      //can't log to Firebase, may be service is not reachable.
      //TODO: save the error and resend when reconnect..
      console.log(
        "can't send error to Firebase. TODO: add code to save it to storage and resend when connection is back."
      );
    }
  }

  render() {
    if (this.state.hasError) {
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
