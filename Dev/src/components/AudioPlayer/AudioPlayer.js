import React, { useState } from "react";

import styled from "styled-components";
import { ProgressBar } from "react-native-paper";
import { TouchableOpacity, Animated, Easing, View } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import colors from "config/colors";

const translateX = new Animated.Value(0);
const scale = new Animated.Value(1);
const rotation = new Animated.Value(0);
const opacity = new Animated.Value(0);

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioPlayer = props => {
  const [toggled, setToggled] = useState(true);
  const [playTime, setPlayTime] = useState(true);
  const [playWidth, setPlayWidth] = useState(true);

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
        duration: 2500,
        easing: Easing.linear
      })
    ).start();
  };

  const onPress = () => {
    setToggled(!toggled);
    if (toggled) {
      animateStartAudio();
      onStartPlay();
    } else {
      animateStopAudio();
      onPausePlay();
    }
    //props.onPress();
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

  onStartPlay = async () => {
    const msg = await audioRecorderPlayer.startPlayer(props.audioFilePath);
    audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
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
  };

  onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
    setToggled(false);
  };

  onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <Container>
      <Row>
        <TouchableOpacity onPress={onPress}>
          <AnimatedImage
            source={toggled ? require("./play-c.png") : require("./pause.png")}
            //source={props.image}
            style={{ transform: [{ scale }, { rotate: spin }] }}
          />
        </TouchableOpacity>
        {toggled && (
          <AudioDesc>
          <AudioStatus>Tasmee' audio recording received.</AudioStatus>
          <Subtitle>Sent: 6/15/19, 5:22pm</Subtitle>
          </AudioDesc>
        )}
      </Row>
      <AnimatedPlaying style={{ transform: [{ translateX }] }}>
        <AnimatedDiskCenter style={{ transform: [{ scale }] }} />
        <AnimatedColumn style={{ opacity: opacityInterpolate }}>
          <Reciter>{props.title}</Reciter>
          <Subtitle>Sent: 6/15/19, 5:22pm</Subtitle>
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

const DiskCenter = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: absolute;
  left: 30px;
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

const Icon = styled.Image``;

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
  font-family: "roboto-bold";
  color: rgba(0, 0, 0, 0.7);
`;

const Subtitle = styled.Text`
  font-size: 12px;
  font-family: "roboto-light";
  color: rgba(0, 0, 0, 0.7);
`;

const Reciter = styled.Text`
  font-size: 15px;
  font-family: "roboto-bold";
  color: rgba(0, 0, 0, 0.7);
`;
