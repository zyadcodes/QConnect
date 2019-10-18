import React, { Component } from 'react';
import { View, ImageBackground, Dimensions, StyleSheet, Alert } from 'react-native';
import Form from 'components/Form';
import ButtonSubmit from 'components/ButtonSubmit';
import SignupSection from 'components/SignupSection';
import QcAppBanner from 'components/QcAppBanner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from "config/strings";
import colors from "config/colors";
import LoadingSpinner from 'components/LoadingSpinner';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

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
    isLoading: false
  };

  onUserNameChange = (_username) => {
    this.setState({ username: _username });
  }

  onPwChange = (_pwd) => {
    this.setState({ password: _pwd });
  }

  onCreateAccount = () => {

    this.props.navigation.push("AccountTypeScreen")
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
        const isTeacher = await FirebaseFunctions.getTeacherByID(userID);
        if (isTeacher === -1) {
          FirebaseFunctions.logEvent("STUDENT_LOG_IN");
          this.props.navigation.push("StudentCurrentClass", {
            userID,
          });
        } else {
          FirebaseFunctions.logEvent("TEACHER_LOG_IN");
          this.props.navigation.push("TeacherCurrentClass", {
            userID,
          })
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
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: 230,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.grey,
    borderBottomWidth: 1,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
    marginLeft: 45,
    marginRight: 45,
    paddingRight: 5,
    paddingLeft: 5
  }
});



export default LoginScreen;

