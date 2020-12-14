import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import AudioPlayer from "components/AudioPlayer/AudioPlayer";
import studentImages from "config/studentImages";

/** {audioFile, profileImageID, studentName, audioSentDateTime} */
const EvaluationAudioPlayer = props => {
  // Show the audio playback button at the top if there is an audio submission
  if (props.audioFile !== -1) {
    return (
      <View style={styles.container}>
        <View style={styles.playAudio}>
          <AudioPlayer
            visible={true}
            compensateForVerticalMove={false}
            image={studentImages.images[props.profileImageID]}
            reciter={props.studentName}
            audioFilePath={props.audioFile}
            hideCancel={true}
            sent={props.audioSentDateTime || ""}
          />
        </View>
      </View>
    );
  } else {
    return <View />;
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10
  }
});

export default EvaluationAudioPlayer;
