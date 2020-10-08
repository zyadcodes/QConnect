import React, { Component } from "react";
import OnlineMeetingScreen from "screens/OnlineMeetingScreen";
import FirebaseFunctions from "config/FirebaseFunctions";

class StudentOnlineMeetingScreen extends Component {
  componentDidMount() {
    FirebaseFunctions.setCurrentScreen(
      "Student Online Meeting Screen",
      "StudentOnlineMeetingScreen"
    );
  }

  render() {
    const { userID } = this.props.navigation.state.params;
    return <OnlineMeetingScreen isStudent={true} userID={userID} />;
  }
}

export default StudentOnlineMeetingScreen;
