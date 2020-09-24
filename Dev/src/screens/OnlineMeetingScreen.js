import React, { Component } from "react";
import QCWebView from "components/QCWebView";
import FirebaseFunctions from "config/FirebaseFunctions";
import { getMeetingLink } from "utils/MeetNowHelper";

class OnlineMeetingScreen extends Component {
  state = {
    meetingLink: "",
  };

  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen(
      "Online Meeting Screen",
      "OnlineMeetingScreen"
    );

    await this.initScreen();
  }

  async initScreen() {
    const { userID } = this.props.navigation.state.params;
    const teacher = await FirebaseFunctions.getTeacherByID(userID);
    const { currentClassID } = teacher;
    const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
    const { name } = currentClass;
    let { meetingLink } = currentClass;

    if (meetingLink === undefined) {
      meetingLink = await getMeetingLink(name);
      console.log("Saving class meeting link: " + meetingLink);
      FirebaseFunctions.updateClassObject(currentClassID, {
        meetingLink
      });
    }

    this.setState({ meetingLink });

  }

  render() {
    const { meetingLink } = this.state;
    return <QCWebView uri={meetingLink} />;
  }
}

export default OnlineMeetingScreen;
