// ------- FlowLayout: Sorts items in a way similar to Android's FlowLayout ------
// items flowing through the row and then overflowing down to next columns ------
//--------------------------------------------------------------------------------
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  PixelRatio,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput
} from "react-native";
import colors from "config/colors";
import strings from "config/strings";
import QcActionButton from "./QcActionButton";
import { Badge } from "react-native-elements";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";
import { Icon } from "react-native-elements";

class FlowView extends Component {
  static propTypes = {
    backgroundColors: PropTypes.array,
    textColors: PropTypes.array,
    text: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    readOnly: PropTypes.bool
  };

  static defaultProps = {
    backgroundColors: [colors.lightGrey, colors.primaryLight],
    textColors: [colors.darkGrey, colors.primaryDark],
    isSelected: false,
    readOnly: false
  };

  constructor(props) {
    super(props);

    this.state = {
      isSelected: this.props.isSelected
    };
  }

  setSelected(bool) {
    this.setState({
      isSelected: bool
    });
  }

  _backgoundColor() {
    if (this.state.isSelected) {
      return this.props.backgroundColors[1];
    } else {
      return this.props.backgroundColors[0];
    }
  }

  _textColor() {
    if (this.state.isSelected) {
      return this.props.textColors[1];
    } else {
      return this.props.textColors[0];
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          disabled={this.props.readOnly}
          onPress={() => {
            if (!this.props.readOnly) {
              this.props.onClick();
              if (
                this.props.text !== strings.Ellipses &&
                this.props.text !== strings.PlusSign &&
                !this.props.editMode &&
                !this.props.isBadgeVisible
              ) {
                this.setState({ isSelected: !this.state.isSelected });
              }
            }
          }}
        >
          <View
            style={[
              styles.corner,
              {
                flexDirection: "row",
                backgroundColor: this.props.backgroundColor
                  ? this.props.backgroundColor
                  : this._backgoundColor()
              }
            ]}
          >
            <Icon
              name="tag"
              size={15}
              containerStyle={{ paddingRight: 5 }}
              style={{ paddingRight: 5 }}
              type="simple-line-icon"
              color={colors.darkGrey}
            />

            <Text
              style={[
                fontStyles.mainTextStyleBlack,
                { textAlign: "center", color: this._textColor() }
              ]}
            >
              {this.props.text}
            </Text>
          </View>
          {this.props.isBadgeVisible ? (
            <Badge
              value={strings.MinusSign}
              badgeStyle={{
                width: 0.03 * screenHeight,
                height: 0.03 * screenHeight,
                borderRadius: 0.015 * screenHeight,
                backgroundColor: colors.red
              }}
              textStyle={styles.minusText}
              containerStyle={{ position: "absolute", top: 2, right: 2 }}
            />
          ) : (
            <View />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

export default class FlowLayout extends Component {
  static propTypes = {
    style: PropTypes.object,
    dataValue: PropTypes.array,
    title: PropTypes.string,
    multiselect: PropTypes.bool,
    onSelectionChanged: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
  };
  static defaultProps = {
    style: {},
    dataValue: [],
    multiselect: true,
    title: strings.ImprovementAreas,
    readOnly: false
  };
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      dataValue: this.props.dataValue,
      selectedState:
        this.props.initialSelectedValues.length === 0
          ? new Array(this.props.dataValue.length).fill(false)
          : new Array(this.props.initialSelectedValues.length).fill(true),
      isBadgeVisible: false,
      isNewAddition: true,
      newImprovementText: ""
    };
  }

  componentDidMount() {
    this.change();
  }

  change() {
    for (var i = 0; i < this.state.selectedState.length; i++) {
      let item = this.refs[this.state.dataValue[i]];
      if (item) {
        item.setSelected(this.state.selectedState[i]);
      }
    }

    this.props.onSelectionChanged(this.getSelectedPosition());
  }
  getSelectedPosition() {
    let list = [];
    this.state.selectedState.forEach((value, key) => {
      if (value) {
        list.push(this.state.dataValue[key]);
      }
    });
    return list;
  }
  resetData() {
    this.setState(
      {
        selectedState: new Array(this.state.dataValue.length).fill(false)
      },
      () => {
        this.change();
      }
    );
  }
  openCustomImprovements() {
    this.setState({ modalVisible: true });
  }

  render() {
    const { dataValue } = this.state;
    //Creates a new array of data values that exclude the ellipses & instead
    //include an addition symbol to add new improvments
    return (
      <View>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          presentationStyle="overFullScreen"
        >
          <View style={styles.modalStyle}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center"
              }}
            >
              {this.state.isBadgeVisible === true
                ? dataValue.map((value, position) => {
                    return (
                      <View key={position}>
                        <FlowView
                          isBadgeVisible={true}
                          ref={this.state.dataValue[position]}
                          text={value}
                          readOnly={false}
                          onClick={() => {
                            dataValue.splice(position, 1);
                            this.setState({ dataValue });
                          }}
                        />
                      </View>
                    );
                  })
                : dataValue.map((value, position) => {
                    return (
                      <View key={position}>
                        <FlowView
                          ref={this.state.dataValue[position]}
                          text={value}
                          editMode={true}
                          readOnly={false}
                          onClick={() => {}}
                        />
                      </View>
                    );
                  })}
              {this.state.isBadgeVisible === true ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {this.state.isNewAddition === true ? (
                    <TextInput
                      style={[
                        styles.textInputStyle,
                        {
                          minWidth:
                            this.state.newImprovementText.length * 4 + 80
                        }
                      ]}
                      placeholder={strings.OtherArea}
                      value={
                        this.state.newImprovementText.length > 0
                          ? this.state.newImprovementText
                          : undefined
                      }
                      autoCorrect={false}
                      onChangeText={text => {
                        this.setState({ newImprovementText: text });
                      }}
                      onEndEditing={() => {
                        this.state.newImprovementText
                          ? dataValue.push(this.state.newImprovementText)
                          : {};
                        this.setState({
                          dataValue,
                          isNewAddition: false,
                          newImprovementText: ""
                        });
                        this.setState({ isNewAddition: true });
                      }}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              ) : (
                <FlowView
                  text={strings.Ellipses}
                  backgroundColor={colors.primaryLight}
                  onClick={() => {
                    this.setState({ isBadgeVisible: true });
                  }}
                />
              )}
            </View>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <QcActionButton
                text={strings.Done}
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.container}>
          {dataValue.map((value, position) => {
            return (
              <View key={position}>
                <FlowView
                  ref={dataValue[position]}
                  text={value}
                  readOnly={this.props.readOnly}
                  onClick={() => {
                    if (this.props.multiselect == false) {
                      for (
                        var i = this.state.selectedState.length - 1;
                        i >= 0;
                        i--
                      ) {
                        if (i == position) {
                          continue;
                        }
                        if (this.state.selectedState[i] == true) {
                          this.state.selectedState[i] = false;
                          break;
                        }
                      }
                    }
                    this.state.selectedState[position] = !this.state
                      .selectedState[position];

                    this.change();
                  }}
                />
              </View>
            );
          })}
          {//Only shows the ellipses if this is not read only
          !this.props.readOnly ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.isNewAddition === true ? (
                <TextInput
                  style={[
                    styles.textInputStyle,
                    {
                      minWidth: this.state.newImprovementText.length * 4 + 80
                    }
                  ]}
                  value={this.state.newImprovementText}
                  placeholder={strings.OtherArea}
                  value={this.state.newImprovementText}
                  autoCorrect={false}
                  onChangeText={text => {
                    this.setState({ newImprovementText: text });
                  }}
                  onEndEditing={() => {
                    this.state.newImprovementText
                      ? dataValue.push(this.state.newImprovementText)
                      : {};
                    this.setState({
                      dataValue,
                      isNewAddition: false,
                      newImprovementText: ""
                    });
                    this.setState({ isNewAddition: true });
                  }}
                />
              ) : (
                <View />
              )}
              <FlowView
                text={strings.Ellipses}
                backgroundColor={colors.primaryLight}
                onClick={() => {
                  this.openCustomImprovements();
                  this.setState({ isNewAddition: true });
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    height: screenHeight * 0.707,
    flexDirection: "column",
    marginTop: screenHeight * 0.15,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.grey,
    borderBottomWidth: 1,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: 0.003 * screenHeight },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 0.003 * screenHeight,
    marginHorizontal: screenWidth * 0.05
  },
  textInputStyle: {
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.grey,
    borderWidth: 1 / PixelRatio.get(),
    borderRadius: 5,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0.024 * screenWidth,
	marginTop: 0.015 * screenHeight,
	paddingHorizontal: 2
  },
  corner: {
    borderColor: colors.grey,
    borderWidth: 1 / PixelRatio.get(),
    borderRadius: 5,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0.024 * screenWidth,
    marginRight: 0.024 * screenWidth,
    marginTop: 0.015 * screenHeight
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 0.036 * screenWidth,
    width: screenWidth * 0.9
  },
  text: {
    fontSize: 16,
    textAlign: "center"
  },
  minusText: {
    fontSize: 10,
    color: colors.white
  }
});
