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
        <HorizontalContainer>
          <AvatarSubTitle numberOfLines={1}>{props.avatarName}</AvatarSubTitle>
          {props.allowSwitchStudents && (
            <Icon
              name={showPeoplePicker === false ? 'angle-down' : 'angle-up'}
              type="font-awesome"
              color={colors.primaryDark}
              size={15}
            />
          )}
        </HorizontalContainer>
      </LeftAvatarContainer>
      <MiddleContainer>
        <Title accessibilityLabel="header_title">{props.title}</Title>
        <SubtitleContainer>
          <Subtitle>{props.subtitle}</Subtitle>
          {props.allowSwitchAssignments && (
            <Icon
              name={showPeoplePicker === false ? 'angle-down' : 'angle-up'}
              type="font-awesome"
              color={colors.primaryDark}
              size={15}
            />
          )}
        </SubtitleContainer>
      </MiddleContainer>
      <RightContainer>
        <Icon
          name="close"
          type="material-community"
          color={colors.darkGrey}
          size={30}
          onPress={props.onClose}
        />
      </RightContainer>
    </Container>
  );
};

export default Header;

export const headerHeight = 90;

const Container = styled.View`
  width: 100%;
  min-height: ${headerHeight};
  padding-top: 15px;
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

const HorizontalContainer = styled.View`
  flex-direction: row;
`;

const SubtitleContainer = styled.View`
  flex-direction: row;
  padding-top: 5px;
`;

const MiddleContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  padding-top: 3px;
  text-align: center;
  font-size: ${mainFont};
  font-family: ${fontFamily};
  color: ${colors.darkGrey};
`;

const Subtitle = styled.Text`
  text-align: center;
  padding-right: 5px;
  font-size: ${bodyFontBig};
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
