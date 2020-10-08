import React, { Component } from "react";
import OnlineMeetingScreen from "screens/OnlineMeetingScreen";
import FirebaseFunctions from "config/FirebaseFunctions";

class TeacherOnlineMeetingScreen extends Component {
  componentDidMount() {
    FirebaseFunctions.setCurrentScreen(
      "Student Online Meeting Screen",
      "StudentOnlineMeetingScreen"
    );
  }

  render() {
    const { userID } = this.props.navigation.state.params;
    return <OnlineMeetingScreen isStudent={false} userID={userID} />;
  }
}

export default TeacherOnlineMeetingScreen;
