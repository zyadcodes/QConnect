import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import MushafScreen from "./MushafScreen";
import LoadingSpinner from "components/LoadingSpinner";
import studentImages from "config/studentImages";
import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';
import { noAyahSelected, noSelection } from 'screens/MushafScreen/Helpers/consts';


class MushafReadingScreen extends Component {
  state = {
    selection: this.props.navigation.state.params.assignmentLocation
      ? {
          start: this.props.navigation.state.params.assignmentLocation.start,
          end: this.props.navigation.state.params.assignmentLocation.end,
          started: false,
          completed: true
        }
      : noSelection,
    isLoading: true,
    isPlaying: false,
  };

  static track = undefined;

  async componentDidMount() {
    this.setState({ isLoading: false });
  }

  closeScreen() {
    const { userID } = this.props.navigation.state.params;

    //todo: if we need to generalize this, then we can add a props: onClose, and the caller specifies the onClose behavior with
    // the call to push navigation to the proper next screen.
    this.props.navigation.push("StudentCurrentClass", {
      userID,
      logAsPractice: true
    });
  }

  onSelectAyah(selectedAyah, selectedWord) {
    if (this.state.isPlaying) {
      if (this.track !== undefined) {
        this.track.stop();
        this.setState({
          highlightedWords: undefined,
          highlightedAyahs: undefined,
          isPlaying: false,
          isAudioLoading: false,
        });
      }
      return;
    }
    //todo: implement audio playback
    if (selectedWord) {
      let location =
        ('00' + selectedAyah.surah).slice(-3) +
        ('00' + selectedAyah.ayah).slice(-3);

      // 'https://dl.salamquran.com/ayat/afasy-murattal-192/' +
      // location +
      // ".mp3";

      if (selectedWord.audio) {
        let url = "";
        if (selectedWord.char_type === "word") {
          this.setState({ highlightedWords: [Number(selectedWord.id)] });
          url = `https://dl.salamquran.com/wbw/${selectedWord.audio}`;
        } else if (selectedWord.char_type === "end") {
          this.setState({ highlightedAyahs: selectedAyah });
          url = `https://dl.salamquran.com/ayat/afasy-murattal-192/${
            selectedWord.audio
          }`;
        }
        this.playTrack(url);
      }
    }
  }

  playTrack = url => {
    this.setState({ isPlaying: true, isAudioLoading: true });
    this.track = new Sound(url, null, e => {
      if (e) {
        console.log("e: " + JSON.stringify(e));
        this.setState({
          highlightedWords: undefined,
          highlightedAyahs: undefined,
          isAudioLoading: false,
          isPlaying: false,
        });
      } else {
        this.setState({ isAudioLoading: false });
        this.track.play(success => {
          this.setState({
            highlightedWords: undefined,
            highlightedAyahs: undefined,
            isPlaying: false,
          });
        });
      }
    });
  };

  render() {
    const {
      userID,
      assignmentName,
      assignmentLocation,
      assignmentType,
      currentClass,
      studentID,
      classID,
      imageID,
    } = this.props.navigation.state.params;

    const { selection, isLoading } = this.state;

    if (isLoading === true) {
      return (
        <View
          id={this.state.page + "spinner"}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <KeepAwake />
          <MushafScreen
            assignToID={studentID}
            classID={classID}
            profileImage={studentImages.images[imageID]}
            selection={selection}
            showLoadingOnHighlightedAyah={
              this.state.isAudioLoading === true &&
              this.state.highlightedAyahs !== undefined
            }
            highlightedWords={this.state.highlightedWords}
            highlightedAyahs={this.state.highlightedAyahs}
            assignmentName={assignmentName}
            assignmentLocation={assignmentLocation}
            assignmentType={assignmentType}
            topRightIconName="close"
            topRightOnPress={this.closeScreen.bind(this)}
            onClose={this.closeScreen.bind(this)}
            currentClass={currentClass}
            onSelectAyah={this.onSelectAyah.bind(this)}
            disableChangingUser={true}
          />
        </View>
      );
    }
  }
}

export default MushafReadingScreen;
