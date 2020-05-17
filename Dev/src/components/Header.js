import { PixelRatio, Text } from "react-native";
import { Avatar, Icon } from 'react-native-elements';
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import {
  bodyFontSmaller,
  mainFont,
  bodyFontBig,
  fontFamily,
} from "../../config/fontStyles";
import colors from "config/colors";

const Header = props => {
  //whether or not to show the menu where teacher can select a student
  const [showPeoplePicker, setShowPeoplePicker] = useState(false);
  return (
    <Container>
      <LeftAvatarContainer>
        <Avatar rounded source={props.avatarImage} />
        <AvatarFooterContainer>
          <AvatarSubTitle numberOfLines={1}>{props.avatarName}</AvatarSubTitle>
          <Icon
            name={showPeoplePicker === false ? 'angle-down' : 'angle-up'}
            type="font-awesome"
            color={colors.primaryDark}
            size={14}
          />
        </AvatarFooterContainer>
      </LeftAvatarContainer>
      <MiddleContainer>
        <Title>{props.title}</Title>
        <Subtitle>{props.subtitle}</Subtitle>
      </MiddleContainer>
      <RightContainer />
    </Container>
  );
};

export default Header;

const mainTextSize = PixelRatio.get() < 2 ? 10 : 12;
// const imageDiameter = PixelRatio.get() < 2 ? 35 : 50;

const Container = styled.View`
  width: 100%;
  min-height: 100px;
  box-shadow: 0 50px 57px #000000;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const LeftAvatarContainer = styled.View`
  width: 80;
  justify-content: center;
  align-items: center;
`;

const AvatarFooterContainer = styled.View`
  flex-direction: row;
`;

const MiddleContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  padding-top: 5px;
  text-align: center;
  font-size: ${bodyFontBig};
  font-family: ${fontFamily};
  color: ${colors.darkGrey};
`;

const Subtitle = styled.Text`
  padding-top: 5px;
  text-align: center;
  font-size: ${mainFont};
  font-family: ${fontFamily};
  color: ${colors.primaryDark};
`;

const AvatarSubTitle = styled.Text`
  text-align: center;
  padding-horizontal: 3px;
  font-size: ${bodyFontSmaller};
  font-family: ${fontFamily};
  color: ${colors.primaryDark};
`;

const RightContainer = styled.View`
  justify-content: center;
  align-items: center;
  min-width: 80;
`;
