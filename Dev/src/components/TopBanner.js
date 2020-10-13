//Component represents a top banner that will have three components within it,
//an icon, a title, and another icon that will all be equally seperated
import FontLoadingComponent from "./FontLoadingComponent";
import React from "react";
import ImageSelectionModal from "components/ImageSelectionModal";
import strings from "config/strings";
import PropTypes from "prop-types";
import classImages from "config/classImages";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Icon } from "react-native-elements";
import colors from "config/colors";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";
import { TextInput } from "react-native-gesture-handler";
import TouchableText from "components/TouchableText";

class TopBanner extends FontLoadingComponent {
  state = {
    modalVisible: false
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  editProfilePic() {
    this.setModalVisible(true);
  }
  onImageSelected(index) {
    this.setState({ profileImageID: index });
    this.setModalVisible(false);
    this.props.onEditingPicture(index);
  }
  render() {
    //Component properties
    const {
      LeftIconName,
      LeftTextName,
      LeftOnPress,
      Title,
      isEditingTitle,
      onTitleChanged,
      isEditingPicture,
      RightIconName,
      RightTextName,
      RightOnPress,
      profileImageID
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.entireTopView}>
          <View style={styles.flexHalf} />
          <View style={styles.topLeftView}>
            {isEditingPicture ? (
              <View>
                <ImageSelectionModal
                  visible={this.state.modalVisible}
                  images={classImages.images}
                  cancelText={strings.Cancel}
                  setModalVisible={this.setModalVisible.bind(this)}
                  onImageSelected={this.onImageSelected.bind(this)}
                />
                <View style={styles.picContainer}>
                  <Image
                    style={styles.profilePic}
                    source={classImages.images[profileImageID]}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.topBannerLeftButtonStyle}
                onPress={
                  LeftOnPress
                    ? () => {
                        LeftOnPress();
                      }
                    : () => {}
                }
                accessibilityLabel="TopBannerLeftButton"
              >
                <Icon name={LeftIconName} type="font-awesome" />
                <Text
                  style={fontStyles.mainTextStyleBlack}
                  onPress={
                    LeftOnPress
                      ? () => {
                          LeftOnPress();
                        }
                      : () => {}
                  }
                >
                  {LeftTextName}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.topMiddleView}>
            {isEditingTitle ? (
              <TextInput
                value={Title}
                accessibilityLabel="TopBannerMiddleTextInput"
                selectTextOnFocus={true}
                onChangeText={onTitleChanged}
                style={styles.topBannerTitleTextInput}
              />
            ) : (
              <Text style={fontStyles.bigTextStylePrimaryDark}>{Title}</Text>
            )}
          </View>

          <View style={styles.topRightView}>
            <TouchableOpacity
              style={styles.topBannerRightStyle}
              onPress={
                RightOnPress
                  ? () => {
                      RightOnPress();
                    }
                  : () => {}
              }
            >
              <Icon name={RightIconName} type="font-awesome" />
              <Text
                style={fontStyles.mainTextStyleBlack}
                onPress={
                  RightOnPress
                    ? () => {
                        RightOnPress();
                      }
                    : () => {}
                }
                accessibilityLabel="TopBannerRightButton"
              >
                {RightTextName}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.flexHalf} />
        </View>

        {isEditingTitle && (
          <View style={styles.updateImage}>
            <TouchableText
              text={"Update Image"}
              onPress={() => this.editProfilePic()}
            />
          </View>
        )}
      </View>
    );
  }
}

//Verifies the propTypes are correct
TopBanner.propTypes = {
  LeftIconName: PropTypes.string,
  LeftTextName: PropTypes.string,
  LeftOnPress: PropTypes.func,
  Title: PropTypes.string,
  RightIconName: PropTypes.string,
  RightTextName: PropTypes.string,
  RightOnPress: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.125,
    backgroundColor: colors.white,
    borderBottomWidth: 0.25,
    borderBottomColor: colors.black
  },
  entireTopView: {
    height: screenHeight * 0.095,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  flexHalf: { flex: 0.5 },
  topLeftView: {
    flex: 1,
    paddingTop: screenHeight * 0.035,
    paddingBottom: screenHeight * 0.01,
  },
  topBannerLeftButtonStyle: {
    flex: 1,
    flexDirection: "row",
    height: screenHeight * 0.15,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  topMiddleView: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    flex: 10,
    paddingTop: screenHeight * 0.035,
    paddingBottom: screenHeight * 0.01,
  },
  topBannerTitleTextInput: {
    ...fontStyles.mainTextStyleBlack,
    paddingVertical: 2,
    minWidth: screenWidth * 0.4,
    backgroundColor: colors.lightGrey,
    borderRadius: 400,
    textAlign: "center"
  },
  topBannerRightStyle: {
    flex: 1,
    flexDirection: "row",
    height: screenHeight * 0.15,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  topRightView: {
    flex: 1.5,
    justifyContent: "center",
    paddingTop: screenHeight * 0.035,
    paddingBottom: screenHeight * 0.01,
  },
  profilePic: {
    width: screenHeight * 0.06,
    height: screenHeight * 0.06,
    borderRadius: screenHeight * 0.09
  },
  picContainer: {
    paddingTop: 0 - screenHeight * 0.02,
    //width: screenHeight *.03,
    //height: screenHeight *.03,
    alignItems: "center"
  },
  updateImage: {
    paddingLeft: screenWidth * 0.01,
  }
});
export default TopBanner;
