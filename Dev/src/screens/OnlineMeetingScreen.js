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
    const { userID, isStudent } = this.props;
    let currentClassID = "";

    if (isStudent === true) {
      const student = await FirebaseFunctions.getStudentByID(userID);
      currentClassID = student.currentClassID;
    } else {
      const teacher = await FirebaseFunctions.getTeacherByID(userID);
      currentClassID = teacher.currentClassID;
    }

    const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
    const { name } = currentClass;
    let { meetingLink } = currentClass;
    if (!meetingLink || meetingLink.length === 0) {
      
      meetingLink = await getMeetingLink(name);
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
