import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet, Alert } from 'react-native';
import Form from 'components/Form';
import ButtonSubmit from 'components/ButtonSubmit';
import SignupSection from 'components/SignupSection';
import QcAppBanner from 'components/QcAppBanner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from "config/strings";
import LoadingSpinner from 'components/LoadingSpinner';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import { screenHeight, screenWidth } from 'config/dimensions';


const BG_IMAGE = require("assets/images/read_child_bg.jpg");


class LoginScreen extends Component {

  _isMounted = false;
  //Sets the screen for firebase analytics
  componentDidMount() {

    this._isMounted = true;
    FirebaseFunctions.setCurrentScreen("Log In Screen", "LogInScreen");

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //Fetches the passed in params that decide whether this is a teacher or a student
  state = {
    username: "",
    password: "",
    isTeacher: this.props.navigation.state.params.isTeacher,
    isLoading: false
  };

  onUserNameChange = (_username) => {
    this.setState({ username: _username });
  }

  onPwChange = (_pwd) => {
    this.setState({ password: _pwd });
  }

  onCreateAccount = () => {

    if (this.state.isTeacher === true) {
      this.props.navigation.navigate('TeacherWelcomeScreen');
    } else {
      this.props.navigation.navigate('StudentWelcomeScreen');
    }
  }

  //Logs the user in, fetches their ID, and then navigates to the correct screen according to whether they
  //are a student or a teacher
  async signIn() {
    this.setState({ isLoading: true });
    const { username, password } = this.state;

    if (username.trim() === "" || (!password.replace(/\s/g, '').length)) {
      Alert.alert(string.Whoops, strings.PleaseMakeSureAllFieldsAreFilledOut);
    } else {
      const account = await FirebaseFunctions.logIn(username.trim(), password.trim());
      if (account === -1) {
        this.setState({
          isLoading: false,
        });
        this.onUserNameChange(username);
        this.onPwChange(password)
        Alert.alert(strings.Whoops, strings.IncorrectInfo);
      } else {
        const userID = account.uid;
        if (this.state.isTeacher === true) {
          FirebaseFunctions.logEvent("TEACHER_LOG_IN");
          this.props.navigation.push("TeacherCurrentClass", {
            userID,
          })
        } else {
          FirebaseFunctions.logEvent("STUDENT_LOG_IN");
          this.props.navigation.push("StudentCurrentClass", {
            userID,
          });
        }
      }
    }
  }

  onForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
  }

  render() {

    if (this.state.isLoading === true) {
      return (
        <QCView style={screenStyle.container}>
          <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <LoadingSpinner isVisible={true} />
            </View>
          </ImageBackground>
        </QCView>
      )
    }
    return (
      <QCView style={screenStyle.container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          <View style={{ flex: 4, justifyContent: 'center' }}>
            <QcAppBanner />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Form
              onUserNameChange={this.onUserNameChange.bind(this)}
              onPwChange={this.onPwChange.bind(this)}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ButtonSubmit
              text={strings.Login}
              onSubmit={this.signIn.bind(this)}
              navigation={this.props.navigation}
              screen="LoginScreen" />
          </View>
          <View style={{ flex: 0.5, justifyContent: 'flex-start' }}>
            <SignupSection
              onCreateAccount={this.onCreateAccount.bind(this)}
              onForgotPassword={this.onForgotPassword.bind(this)}
            />
          </View>
          <View style={{ flex: 1 }}></View>
        </ImageBackground>
      </QCView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spacer: {
    flex: 3
  },
  bgImage: {
    flex: 5,
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center"
  },
});



export default LoginScreen;

