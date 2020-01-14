/* eslint-disable quotes */
import React, { useState } from "react";

import styled from "styled-components";
import { ProgressBar } from "react-native-paper";
import {
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Platform
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

const translateX = new Animated.Value(0);
const scale = new Animated.Value(1);
const rotation = new Animated.Value(0);
const opacity = new Animated.Value(0);

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioPlayer = props => {
  const [toggled, setToggled] = useState(true);
  const [playTime, setPlayTime] = useState(0);
  const [playWidth, setPlayWidth] = useState(0);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [recordingPlaybackPlaying, setRecordingPlaybackPlaying] = useState(
    false
  );

  audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });
  ``;
  const opacityInterpolate = opacity.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [0, 0, 1]
  });

  const rotationLoop = () => {
    return Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear
      })
    ).start();
  };

  onStartPlay = async () => {
    try {
      const msg = await audioRecorderPlayer.startPlayer(props.audioFilePath);
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
      } else {
        setPlayWidth(e.current_position / e.duration);
      }
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
    });

    return true;
  };

  onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
    setToggled(true);
  };

  onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  var uri = "";

  onStartRecord = async () => {
    setRecordingCompleted(false);
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

    const path = Platform.select({
      ios: "hello.m4a",
      android: "sdcard/hello.mp4"
    });
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

  onStopRecord = async () => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setPlayWidth(0);
    setRecordingCompleted(true);
    props.onStopRecording("/sdcard/hello.mp4");
  };

  const onStartAction = async () => {
    if (props.isRecordMode === true) {
      return await onStartRecord();
    } else {
      return await onStartPlay();
    }
  };

  const onStopAction = async () => {
    if (props.isRecordMode === true) {
      await onStopRecord();
    } else {
      await onPausePlay();
    }
    setToggled(true);
  };

  const onPress = async () => {
    if (toggled) {
      let success = await onStartAction();
      if (success) {
        setToggled(false);
        animateStartAudio();
      } else {
        setToggled(true);
        //Alert.alert(strings.Whoops, props.isRecordMode? strings.FailedToRecordAudio : strings.FailedToPlayAudioFile);
      }
    } else {
      animateStopAudio();
      onStopAction();
    }
  };

  //handles re-play button after recording an audio
  const onPlayRecording = async () => {
    if (props.isRecordMode && recordingCompleted) {
      if (!recordingPlaybackPlaying) {
        setRecordingPlaybackPlaying(true);
        return await onStartPlay();
      } else {
        setRecordingPlaybackPlaying(false);
        return await onPausePlay();
      }
    }
  };

  const animateStartAudio = () => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: 35 }),
      Animated.timing(scale, { toValue: 1.2 }),
      rotationLoop(),
      Animated.timing(opacity, { toValue: 1 })
    ]).start();
  };

  const animateStopAudio = () => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: -60 }),
      Animated.timing(scale, { toValue: 1 }),
      Animated.timing(rotation, { toValue: 0 }),
      Animated.timing(opacity, { toValue: 0 })
    ]).start();
  };

  return (
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
            style={{ transform: [{ scale }, { rotate: spin }] }}
          />
        </TouchableOpacity>
        {props.isRecordMode && recordingCompleted && (
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
                : recordingCompleted
                ? strings.TasmeeRecorded
                : strings.PressToStartRecording}
            </Subtitle>
          </AudioDesc>
        )}
      </Row>
      <AnimatedPlaying style={{ transform: [{ translateX }] }}>
        <AnimatedColumn style={{ opacity: opacityInterpolate }}>
          <Reciter>{props.title}</Reciter>
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
    </Container>
  );
};

export default AudioPlayer;

const Container = styled.View`
  width: 326px;
  height: 50px;
  border-radius: 14px;
  box-shadow: 0 50px 57px #6f535b;
  justify-content: center;
  align-items: center;
`;

const Image = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
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
  position: absolute;
  left: 20px;
  top: 5px;
  z-index: 10;
  background: #ffffff;
`;

const AnimatedDiskCenter = Animated.createAnimatedComponent(DiskCenter);

const AudioDesc = styled.View`
  padding-left: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  height: 40px;
  width: 280px;
  justify-content: space-between;
  position: absolute;
  right: 30px;
`;

const Playing = styled.View`
  width: 300px;
  height: 50px;
  border-radius: 14px;
  z-index: -1;
  align-items: center;
`;

const AnimatedPlaying = Animated.createAnimatedComponent(Playing);

const Column = styled.View`
  flex-direction: column;
  height: 100%;
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
