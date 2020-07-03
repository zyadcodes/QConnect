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
import QcActionButton from '../QcActionButton/QcActionButton';
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
  const [selectedState, setSelectedState] = useState(new Array(props.dataValue.length).fill(
   props.selectedByDefault === true
  ))
  const [isBadgeVisible, setIsBadgeVisible] = useState(false)
  const [isNewAddition, setIsNewAddition] = useState(true)
  const [newImprovementText, setNewImprovementText] = useState('')

  useEffect(() => {
    change();
  }, [])

  const change = () => {
    for (var i = 0; i < selectedState.length; i++) {
      let item = refs[dataValue[i]];
      if (item) {
        item.setSelected(selectedState[i]);
      }
    }

    props.onSelectionChanged(getSelectedPosition());
  }
  const getSelectedPosition = () => {
    let list = [];
    selectedState.forEach((value, key) => {
      if (value) {
        list.push(dataValue[key]);
      }
    });
    return list;
  }
  const resetData = () => {
        setSelectedState(new Array(dataValue.length).fill(false))
        change();
  }
  const openCustomImprovements = () => {
    setModalVisible(true)
  }

    const { dataValue, selectedState } = state;
    //Creates a new array of data values that exclude the ellipses & instead
    //include an addition symbol to add new improvments
    return (
      <View>
        <Modal
          transparent={true}
          visible={modalVisible}
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
              {isBadgeVisible === true
                ? dataValue.map((value, position) => {
                    return (
                      <View key={position}>
                        <FlowView
                          isBadgeVisible={true}
                          ref={dataValue[position]}
                          text={value}
                          readOnly={false}
                          onClick={() => {
                            dataValue.splice(position, 1);
                            selectedState.splice(position, 1);
                            setDataValue(dataValue)
                          }}
                        />
                      </View>
                    );
                  })
                : dataValue.map((value, position) => {
                    return (
                      <View key={position}>
                        <FlowView
                          ref={dataValue[position]}
                          text={value}
                          editMode={true}
                          readOnly={false}
                          onClick={() => {}}
                        />
                      </View>
                    );
                  })}
              {isBadgeVisible === true ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {isNewAddition === true ? (
                    <TextInput
                      style={[
                        styles.textInputStyle,
                        {
                          minWidth:
                            newImprovementText.length * 4 + 80,
                        },
                        fontStyles.smallTextStyleDarkGrey,
                      ]}
                      placeholder={strings.OtherArea}
                      value={
                        newImprovementText.length > 0
                          ? newImprovementText
                          : undefined
                      }
                      autoCorrect={false}
                      onChangeText={text => {
                        setNewImprovementText(text)
                      }}
                      onEndEditing={() => {
                        if (newImprovementText) {
                          dataValue.push(newImprovementText);
                          selectedState.push(false);
                        }
                          setDataValue(dataValue)
                          setIsNewAddition(true)
                          setNewImprovementText('')
                        props.onImprovementsCustomized(dataValue);
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
                    setIsBadgeVisible(true)
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
                  setModalVisible(false)
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
                  readOnly={props.readOnly}
                  onClick={() => {
                    if (props.multiselect == false) {
                      for (
                        var i = selectedState.length - 1;
                        i >= 0;
                        i--
                      ) {
                        if (i == position) {
                          continue;
                        }
                        if (selectedState[i] == true) {
                          selectedState[i] = false;
                          break;
                        }
                      }
                    }
                    selectedState[position] = !state
                      .selectedState[position];

                    change();
                  }}
                />
              </View>
            );
          })}
          {//Only shows the ellipses if this is not read only
          !props.readOnly ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {isNewAddition === true ? (
                <TextInput
                  style={[
                    fontStyles.smallTextStyleDarkGrey,
                    styles.textInputStyle,
                    {
                      minWidth: newImprovementText.length * 4 + 80
                    },
                  ]}
                  value={newImprovementText}
                  placeholder={strings.OtherArea}
                  value={newImprovementText}
                  autoCorrect={false}
                  onChangeText={text => {
                    setNewImprovementText(text)
                  }}
                  onEndEditing={() => {
                    newImprovementText
                      ? dataValue.push(newImprovementText)
                      : {};
                      setDataValue(dataValue)
                      setIsNewAddition(true)
                      setNewImprovementText('')
                    props.onImprovementsCustomized(dataValue);
                  }}
                />
              ) : (
                <View />
              )}
              <FlowView
                text={strings.Ellipses}
                backgroundColor={colors.primaryLight}
                onClick={() => {
                  openCustomImprovements();
                  setIsNewAddition(true)
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
