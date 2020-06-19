// ------- FlowLayout: Sorts items in a way similar to Android's FlowLayout ------
// items flowing through the row and then overflowing down to next columns ------
//--------------------------------------------------------------------------------
import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  PixelRatio,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import colors from 'config/colors';
import strings from 'config/strings';
import QcActionButton from '../QcActionButton';
import { Badge } from 'react-native-elements';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import { Icon } from 'react-native-elements';
import _ from 'lodash';
import styles from './FlowLayoutStyles'

const FlowView = (props) => {
  const [isSelected, setIsSelected] = useState(props.isSelected);

  const setSelected = (bool) => {
    setIsSelected(bool)
  }

  const _backgoundColor = () => {
    if (isSelected) {
      return props.backgroundColors[1];
    } else {
      return props.backgroundColors[0];
    }
  }

  const _textColor = () => {
    if (isSelected) {
      return props.textColors[1];
    } else {
      return props.textColors[0];
    }
  }

    return (
      <View>
        <TouchableOpacity
          disabled={props.readOnly}
          onPress={() => {
            if (!props.readOnly) {
              props.onClick();
              if (
                props.text !== strings.Ellipses &&
                props.text !== strings.PlusSign &&
                !props.editMode &&
                !props.isBadgeVisible
              ) {
                setIsSelected(!isSelected)
              }
            }
          }}
        >
          <View
            style={[
              styles.corner,
              {
                flexDirection: 'row',
                backgroundColor: props.backgroundColor
                  ? props.backgroundColor
                  : _backgoundColor(),
              },
            ]}
          >
            <Icon
              name="tag"
              size={10}
              containerStyle={{ paddingRight: 5 }}
              style={{ paddingRight: 5 }}
              type="simple-line-icon"
              color={colors.darkGrey}
            />

            <Text
              style={[
                fontStyles.smallTextStyleDarkGrey,
                { textAlign: 'center', color: _textColor() },
              ]}
            >
              {props.text}
            </Text>
          </View>
          {props.isBadgeVisible ? (
            <Badge
              value={strings.MinusSign}
              badgeStyle={{
                width: 0.03 * screenHeight,
                height: 0.03 * screenHeight,
                borderRadius: 0.015 * screenHeight,
                backgroundColor: colors.red,
              }}
              textStyle={styles.minusText}
              containerStyle={{ position: 'absolute', top: 2, right: 2 }}
            />
          ) : (
            <View />
          )}
        </TouchableOpacity>
      </View>
    );
}
FlowView.propTypes = {
  backgroundColors: PropTypes.array,
  textColors: PropTypes.array,
  text: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  readOnly: PropTypes.bool,
};

FlowView.defaultProps = {
  backgroundColors: [colors.lightGrey, colors.primaryLight],
  textColors: [colors.darkGrey, colors.primaryDark],
  isSelected: false,
  readOnly: false,
};

export default FlowLayout = (props) => {

  const [modalVisible, setModalVisible] = useState(false)
  const [dataValue, setDataValue] = useState(props.dataValue),
  const [selectedState, setSelectedState] = useState(new Array(this.props.dataValue.length).fill(
   this.props.selectedByDefault === true
  ))
  const [isBadgeVisible, setIsBadgeVisible] = useState(false)
  const [isNewAddition, setIsNewAddition] = useState(true)
  const [newImprovementText, setNewImprovementText] = useState('')

  useEffect(() => {
    this.change();
  }, [])

  const getDerivedStateFromProps = static (props, state) => {
    //if improvement areas have changed from the calling screen, let's reflect that here.
    //this is a quick way to check if the arrays have the same content
    if (!_.isEmpty(_.xor(props.dataValue, state.dataValue))) {
      return {
        dataValue: props.dataValue
      };
    }
    return null;
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
        selectedState: new Array(this.state.dataValue.length).fill(false),
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
    const { dataValue, selectedState } = this.state;
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
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center'
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
                            selectedState.splice(position, 1);
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
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {this.state.isNewAddition === true ? (
                    <TextInput
                      style={[
                        styles.textInputStyle,
                        {
                          minWidth:
                            this.state.newImprovementText.length * 4 + 80,
                        },
                        fontStyles.smallTextStyleDarkGrey,
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
                        if (this.state.newImprovementText) {
                          dataValue.push(this.state.newImprovementText);
                          selectedState.push(false);
                        }
                        this.setState({
                          dataValue,
                          isNewAddition: true,
                          newImprovementText: ''
                        });
                        this.props.onImprovementsCustomized(dataValue);
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
              style={{ justifyContent: 'space-between', flexDirection: 'row' }}
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {this.state.isNewAddition === true ? (
                <TextInput
                  style={[
                    fontStyles.smallTextStyleDarkGrey,
                    styles.textInputStyle,
                    {
                      minWidth: this.state.newImprovementText.length * 4 + 80
                    },
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
                      isNewAddition: true,
                      newImprovementText: ''
                    });
                    this.props.onImprovementsCustomized(dataValue);
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
FlowLayout.propTypes = {
  style: PropTypes.object,
  dataValue: PropTypes.array,
  title: PropTypes.string,
  multiselect: PropTypes.bool,
  onSelectionChanged: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  selectedByDefault: PropTypes.bool,
};
FlowLayout.defaultProps = {
  style: {},
  dataValue: [],
  multiselect: true,
  title: strings.ImprovementAreas,
  readOnly: false,
  selectedByDefault: false
};
