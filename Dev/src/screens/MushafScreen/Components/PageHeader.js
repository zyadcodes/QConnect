//Component represents a top banner that will have three components within it,
//an icon, a title, and another icon that will all be equally seperated
import FontLoadingComponent from 'components/FontLoadingComponent';
import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { Icon } from 'react-native-elements';
import StudentSelectorModal from 'components/StudentSelector/StudentSelectorModal';
import colors from 'config/colors';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import studentImages from 'config/studentImages';
import classImages from 'config/classImages';

class PageHeader extends FontLoadingComponent {
  state = {
    selectorModalVisible: false,

    //who are is the assignment for (student or class id)
    assignToID: this.props.assignToID,

    //avatar image of the assignee
    leftImage: this.props.LeftImage
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    //once there is an avatar image and assignee id, let's initialize our state vars with them.
    if (prevState.leftImage === undefined) {
      return {
        leftImage: nextProps.LeftImage,
        assignToID: nextProps.assignToID
      };
    }

    return {};
  }

  onLeftImagePress() {
    if (this.props.currentClass && !this.props.disableChangingUser) {
      const { selectorModalVisible } = this.state;
      this.setState({ selectorModalVisible: !selectorModalVisible });
    }
  }

  setLeftImage(id, imageID, isClassID) {
    if (isClassID === true) {
      this.setState({
        leftImage: classImages.images[imageID],
        assignToID: id
      });
    } else {
      this.setState({
        leftImage: studentImages.images[imageID],
        assignToID: id
      });
    }
  }

  render() {
    //Component properties
    const {
      LeftTextName,
      LeftOnPress,
      Title,
      TitleOnPress,
      currentClass,
      RightIconName,
      RightTextName,
      RightOnPress,
      onSelect,
    } = this.props;

    const { leftImage, assignToID } = this.state;
    return (
      <View style={styles.entireTopView}>
        <View style={{ flex: 0.5 }} />
        <View style={styles.topLeftView}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              height: screenHeight * 0.1,
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
            onPress={() => this.onLeftImagePress()}
          >
            {leftImage && (
              <Image
                style={styles.profilePic}
                source={leftImage}
                ResizeMode="contain"
              />
            )}

            {currentClass && (
              <StudentSelectorModal
                currentClass={currentClass}
                visible={this.state.selectorModalVisible}
                setModalVisible={visible => {
                  const { selectorModalVisible } = this.state;
                  this.setState({ selectorModalVisible: visible });
                }}
                selectedItemID={assignToID}
                onSelect={(id, imageID, isClassID) => {
                  this.setLeftImage(id, imageID, isClassID);
                  onSelect(id, imageID, isClassID);
                }}
              />
            )}

            <Text
              style={fontStyles.mainTextStyleBlack}
              onPress={
                currentClass
                  ? () => {
                      LeftOnPress();
                    }
                  : () => {}
              }
            >
              {LeftTextName}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topMiddleView}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              height: screenHeight * 0.03,
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
            onPress={
              TitleOnPress
                ? () => {
                    TitleOnPress();
                  }
                : () => {}
            }
          >
            <ImageBackground
              source={require('assets/images/quran/title-frame.png')}
              style={{
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center'
              }}
              resizeMethod="scale"
            >
              <Text style={fontStyles.bigTextStylePrimaryDark}>{Title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={styles.topRightView}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              height: screenHeight * 0.03,
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
            onPress={
              RightOnPress
                ? () => {
                    RightOnPress();
                  }
                : () => {}
            }
          >
            <Icon name={RightIconName} type="material-community" />
            <Text
              style={fontStyles.mainTextStyleBlack}
              onPress={
                RightOnPress
                  ? () => {
                      RightOnPress();
                    }
                  : () => {}
              }
            >
              {RightTextName}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.5 }} />
      </View>
    );
  }
}

//Verifies the propTypes are correct
PageHeader.propTypes = {
  LeftIconName: PropTypes.string,
  LeftTextName: PropTypes.string,
  LeftOnPress: PropTypes.func,
  Title: PropTypes.string,
  RightIconName: PropTypes.string,
  RightTextName: PropTypes.string,
  RightOnPress: PropTypes.func,
};

const styles = StyleSheet.create({
  entireTopView: {
    height: screenHeight * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 0.25,
    borderBottomColor: colors.black,
  },
  topLeftView: {
    flex: 1.5,
    paddingTop: screenHeight * 0.035,
    paddingBottom: screenHeight * 0.001
  },
  topMiddleView: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flex: 10,
    paddingTop: screenHeight * 0.035,
    paddingBottom: screenHeight * 0.001
  },
  topRightView: {
    flex: 1.5,
    justifyContent: 'center',
    paddingTop: screenHeight * 0.035,
    paddingBottom: screenHeight * 0.001
  },
  profilePic: {
    width: 0.05 * screenHeight,
    height: 0.05 * screenHeight,
    borderRadius: 0.025 * screenHeight,
    paddingBottom: 0.001 * screenHeight
  },
});
export default PageHeader;
