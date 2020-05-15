/* eslint-disable quotes */
import React, { useState, useEffect } from "react";

import styled from "styled-components";
import { ProgressBar } from "react-native-paper";
import {
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Platform,
  View
} from "react-native";
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType
} from "react-native-audio-recorder-player";
import colors from "config/colors";
import strings from "config/strings";
import FirebaseFunctions from "config/FirebaseFunctions";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import TouchableText from "components/TouchableText";
import fontStyles from "config/fontStyles";

const translateX = new Animated.Value(0);
const scale = new Animated.Value(1);
const rotation = new Animated.Value(0);
const opacity = new Animated.Value(0);
const postStopAction = {
  none: 0,
  close: 1,
  send: 2
};

const AudioPlayer = props => {
  const [toggled, setToggled] = useState(true);
  const [playTime, setPlayTime] = useState(0);
  const [playWidth, setPlayWidth] = useState(0);
  const [showPlayback, setShowPlayback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSendCancel, setShowSendCancel] = useState(false);
  const [recordingPlaybackPlaying, setRecordingPlaybackPlaying] = useState(
    false
  );
  const [visible, setVisible] = useState(props.visible);
  const [audioRecorderPlayer, setAudioPlayer] = useState(
    new AudioRecorderPlayer()
  );

  useEffect(() => {
    // returned function will be called on component unmount
    return () => {
      if (isRecording) {
        audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
      }
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [audioRecorderPlayer, isRecording]);

  audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  const opacityInterpolate = opacity.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [0, 0, 1]
  });

  const rotationLoop = () => {
    return Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        useNativeDriver: true,
        duration: 2500,
        easing: Easing.linear
      })
    ).start();
  };

  const onStartPlay = async filePath => {
    try {
      let audioFileName =
        filePath !== undefined ? filePath : props.audioFilePath;

      const msg = await audioRecorderPlayer.startPlayer(audioFileName);
      if (msg === undefined) {
        throw "audioRecorderPlayer.startPlayer returned undefined.";
      }
    } catch (error) {
      FirebaseFunctions.logEvent("PLAY_AUDIO_FAILED", { error });
      return false;
    }

    audioRecorderPlayer.setVolume(1.0);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.current_position === e.duration) {
        audioRecorderPlayer.stopPlayer();
        setToggled(true);
        animateStopAudio();
        setPlayWidth(0);
        setRecordingPlaybackPlaying(false);
      } else {
        setPlayWidth(e.current_position / e.duration);
      }
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
    });

    return true;
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setToggled(true);
  };

  var uri = "";
  const path = Platform.select({
    ios: "/recitationRec.m4a",
    android: "sdcard/recitationRec.mp4"
  });

  var RNFS = require("react-native-fs");
  const fullPath = Platform.select({
    ios: RNFS.CachesDirectoryPath + path,
    android: "/" + path
  });

  const onStartRecord = async () => {
    setIsRecording(true);
    setShowPlayback(false);
    setShowSendCancel(true);
    //Handles permissions for microphone usage
    let isGranted = true;

    let permission = "";
    if (Platform.OS === "android") {
      permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
    } else {
      permission = PERMISSIONS.IOS.MICROPHONE;
    }
    let permissionStatus = await request(permission);
    if (permissionStatus === RESULTS.GRANTED) {
      isGranted = true;
    } else {
      isGranted = false;
    }

    //Android also requires another permission
    if (Platform.OS === "android") {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      );
      if (permissionStatus === RESULTS.GRANTED) {
        isGranted = true;
      } else {
        isGranted = false;
      }
    }

    //If mic permission granted, records normally, otherwise, displays a pop up saying
    //the user must enable permissions from settings
    if (!isGranted) {
      Alert.alert(strings.Whoops, strings.EnableMicPermissions);
      return false;
    }

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac
    };

    try {
      uri = await audioRecorderPlayer.startRecorder(path, audioSet);

      audioRecorderPlayer.addRecordBackListener(e => {
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      });
      return true;
    } catch (error) {
      Alert.alert(strings.Whoops, JSON.stringify(error));
      FirebaseFunctions.logEvent("RECORD_AUDIO_FAILED", { error });
      return false;
    }
  };

  //this function stops recording
  // if there is a post action requested after stopping the recording,
  // it will perform that action. The 2 post actions supported are send the audio
  // after stopping or close the dialog.
  const onStopRecord = async postAction => {
    if (isRecording) {
      await audioRecorderPlayer.stopRecorder();
      await audioRecorderPlayer.removeRecordBackListener();
      await onStopPlay();

      setPlayWidth(0);
      setIsRecording(false);
      setShowPlayback(true);
    }

    //let's perform a post action is requested.
    if (postAction === postStopAction.send) {
      props.onSend(fullPath, path);
    } else if (postAction === postStopAction.close) {
      props.onClose();
    }
  };

  const onStartAction = async () => {
    try {
      if (props.isRecordMode === true) {
        return await onStartRecord();
      } else {
        return await onStartPlay();
      }
    } catch (e) {
      Alert.alert(strings.Whoops, strings.SomethingWentWrong);
    }
  };

  const onStopAction = async postAction => {
    try {
      if (props.isRecordMode === true) {
        await onStopRecord(postAction);
      } else {
        await onPausePlay(); //no postAction applicable for now. No need to pass.
      }
    } catch (e) {
      Alert.alert(strings.Whoops, strings.SomethingWentWrong);
    }

    setToggled(true);
  };

  const onPress = async () => {
    try {
      if (toggled) {
        let success = await onStartAction();
        if (success) {
          setToggled(false);
          animateStartAudio();
        } else {
          setToggled(true);
        }
      } else {
        animateStopAudio();
        onStopAction();
      }
    } catch (e) {
      Alert.alert(strings.Whoops, strings.SomethingWentWrong);
    }
  };

  //handles re-play button after recording an audio
  const onPlayRecording = async () => {
    if (props.isRecordMode && showPlayback) {
      if (!recordingPlaybackPlaying) {
        setRecordingPlaybackPlaying(true);
        return await onStartPlay(path);
      } else {
        setRecordingPlaybackPlaying(false);
        return await onPausePlay();
      }
    }
  };

  const animateStartAudio = () => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: 0, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.2, useNativeDriver: true }),
      rotationLoop(),
      Animated.timing(opacity, { toValue: 1, useNativeDriver: true })
    ]).start();
  };

  const animateStopAudio = () => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: 0, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 0, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, useNativeDriver: true })
    ]).start();
  };

  return (
    <View>
      {visible && (
        <Container>
          <Row>
            <TouchableOpacity onPress={onPress}>
              <AnimatedImage
                key={`image_${toggled}`}
                source={
                  toggled
                    ? props.isRecordMode
                      ? require("./record.png")
                      : require("./play-c.png")
                    : require("./pause.png")
                }
                style={{ transform: [{ scale }] }}
              />
            </TouchableOpacity>
            {!toggled && !isRecording && (
              <TouchableOpacity onPress={onStopPlay}>
                <SmallImage source={require("./stop.png")} />
              </TouchableOpacity>
            )}
            {props.isRecordMode && showPlayback && (
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={onPlayRecording}
              >
                <SmallImage
                  source={
                    !recordingPlaybackPlaying
                      ? require("./play-c.png")
                      : require("./pause.png")
                  }
                />
              </TouchableOpacity>
            )}
            {toggled && (
              <AudioDesc>
                <AudioStatus>
                  {props.isRecordMode
                    ? strings.SendRecording
                    : strings.AudioRecordingReceived}
                </AudioStatus>
                <Subtitle>
                  {!props.isRecordMode
                    ? strings.Sent + " " + props.sent
                    : showPlayback
                    ? strings.TasmeeRecorded
                    : strings.PressToStartRecording}
                </Subtitle>
              </AudioDesc>
            )}
            {!toggled && (
              <AnimatedPlaying>
                <AnimatedColumn style={{ opacity: opacityInterpolate }}>
                  <Subtitle>
                    {!props.isRecordMode
                      ? strings.Sent + " " + props.sent
                      : strings.Recording}
                  </Subtitle>
                  <ProgressBar
                    progress={playWidth}
                    color={colors.primaryDark}
                    style={{ width: 150 }}
                  />
                  <Subtitle>{playTime}</Subtitle>
                </AnimatedColumn>
              </AnimatedPlaying>
            )}
          </Row>

          <SendRow>
            {!props.hideCancel &&
              (!(props.isRecordMode && !toggled) && (
                <TouchableText
                  text={strings.Cancel}
                  onPress={() => {
                    animateStopAudio();
                    onStopAction(postStopAction.close);
                  }}
                  style={{
                    ...fontStyles.captionTextStylePrimaryDark,
                    paddingHorizontal: 15,
                    paddingBottom: 5,
                  }}
                />
              ))}
            <HorizontalSpacer />
            {showSendCancel && (
              <TouchableText
                text={strings.Send}
                style={{
                  ...fontStyles.captionTextStylePrimaryDark,
                  paddingHorizontal: 15,
                  paddingBottom: 5,
                }}
                onPress={() => {
                  animateStopAudio();
                  onStopAction(postStopAction.send);
                }}
              />
            )}
          </SendRow>
        </Container>
      )}
    </View>
  );
};

export default AudioPlayer;

const Container = styled.View`
  min-width: 95%;
  min-height: 80px;
  border-radius: 14px;
  box-shadow: 0 50px 57px #6f535b;
  justify-content: flex-start;
  align-items: center;
`;

const Image = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const VerticalSpacer = styled.View`
  height: 40px;
`;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const SmallImage = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-left: 10px;
`;

const DiskCenter = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  left: 20px;
  top: 5px;
  background: #ffffff;
`;

const SendRow = styled.View`
  margin-top: 5px;
  padding-top: 5px;
  padding-right: 20px;
  flex-direction: row;
  justify-content: flex-end;
  align-self: flex-end;
`;

const HorizontalSpacer = styled.View`
  width: 20;
`;

const AnimatedDiskCenter = Animated.createAnimatedComponent(DiskCenter);

const AudioDesc = styled.View`
  padding-left: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  min-height: 40px;
  min-width: 280px;
  margin-top: 5px;
  justify-content: flex-start;
`;

const Playing = styled.View`
  height: 50px;
  border-radius: 14px;
  align-items: flex-start;
  margin-left: 10px;
`;

const AnimatedPlaying = Animated.createAnimatedComponent(Playing);

const Column = styled.View`
  flex-direction: column;
`;

const AnimatedColumn = Animated.createAnimatedComponent(Column);

const AudioStatus = styled.Text`
  font-size: 15px;
  font-family: "Montserrat-Regular";
  color: rgba(0, 0, 0, 0.7);
`;

const Subtitle = styled.Text`
  font-size: 12px;
  font-family: "Montserrat-Light";
  color: rgba(0, 0, 0, 0.7);
`;

const Reciter = styled.Text`
  font-size: 15px;
  font-family: "Montserrat-Bold";
  color: rgba(0, 0, 0, 0.7);
`;
