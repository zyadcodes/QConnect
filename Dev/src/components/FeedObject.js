import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import {
  screenHeight,
  screenWidth,
  screenScale,
  fontScale,
} from '../../config/dimensions';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../config/colors';
import { getPageTextWbW } from '../screens/MushafScreen/ServiceActions/getQuranContent';
import SurahHeader from '../screens/MushafScreen/Components/SurahHeader';
import Basmalah from '../screens/MushafScreen/Components/Basmalah';
import TextLine from '../screens/MushafScreen/Components/TextLine';
import LoadingSpinner from './LoadingSpinner';
import { Icon } from 'react-native-elements';
import ThreadComponent from './ThreadComponent';

export default class FeedsObject extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    Content: PropTypes.object.isRequired,
    userID: PropTypes.string.isRequired,
    reactions: PropTypes.array.isRequired,
    imageRequire: PropTypes.object.isRequired,
    onPressSelectEmoji: PropTypes.func.isRequired
  };
  state = {
    surahName: '',
    page: [],
    isLoading: false,
  };
  async componentDidMount() {
    console.log(screenHeight);
    if (this.props.type === 'assignment') {
      this.setState({ isLoading: true });
      const pageLines = await getPageTextWbW(this.props.Content.start.page);
      let allAyat = (
        <View>
          {pageLines !== undefined &&
            pageLines.map((line, index) => {
              if (
                line.type === 'besmellah' &&
                this.props.Content.start.ayah === 1
              ) {
                return <Basmalah key={line.line + "_basmalah"} />;
              } else if (
                line.ayah >= this.props.Content.start.ayah &&
                line.ayah <= this.props.Content.end.ayah
              ) {
                return (
                  <TextLine
                    key={this.props.Content.start.page + '_' + line.line}
                    lineText={line.text}
                    selectionOn={false}
                    highlightedWord={undefined}
                    selectedAyahsEnd={this.props.Content.end}
                    selectedAyahsStart={this.props.Content.start}
                    selectionStarted={false}
                    selectionCompleted={false}
                    isFirstWord={false}
                    onSelectAyah={(ayah, word) => {}}
                    page={this.props.Content.start.page}
                    lineAlign={
                      this.props.Content.start.page === 1 ? 'center' : 'stretch'
                    }
                  />
                );
              }
            })}
        </View>
      );
      this.setState({
        surahName: pageLines[0].surah,
        page: allAyat,
        isLoading: false,
      });
    }
  }
  render() {
    return (
      <View style={this.localStyles.containerView}>
        <Image
          source={this.props.imageRequire}
          style={this.localStyles.userImage}
        />
        <View style={{ flex: 2, marginTop: screenScale * 18 }}>
          <View style={{ flex: 5 }}>
            {this.props.type === 'assignment' ? (
              <Text
                style={[
                  this.localStyles.newAssignmentText,
                  { fontSize: fontScale * 18 },
                ]}
              >
                New Assignment:{' '}
              </Text>
            ) : null}
            <View style={this.localStyles.contentContainerView}>
              {this.props.type === 'assignment' ? (
                <QuranAssignmentView
                  surahName={this.state.surahName}
                  page={this.state.page}
                  isLoading={this.state.isLoading}
                  isTeacher={this.props.isTeacher}
                  Content={this.props.Content}
                  madeByUser={this.props.madeByUser}
                  currentUser={this.props.currentUser}
                />
              ) : (
                <Text style={this.localStyles.contentText}>
                  {this.props.Content}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
              <FlatList
                data={this.props.Reactions}
                style={{ flexDirection: 'row' }}
                renderItem={({ item, index, seperators }) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        this.props.Reactions.length > 0 &&
                        this.props.Reactions[index].reactedBy.includes(
                          this.props.currentUser.ID
                        )
                      ) {
                      }
                    }}
                    key={index}
                    activeOpacity={0.6}
                    style={this.localStyles.Reaction}
                  >
                    <View style={this.localStyles.reactionView}>
                      <Text>{item.reactedBy.length}</Text>
                      <Text>{item.emoji}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              {this.props.madeByUser == this.props.currentUser.ID ? null : (
                <TouchableOpacity
                  onPress={() => this.props.onPressSelectEmoji()}
                  style={this.localStyles.addReaction}
                  activeOpacity={0.6}
                >
                  <Icon
                    name="plus"
                    type="entypo"
                    size={fontScale * 16}
                    color={colors.primaryDark}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {this.props.Comments.length === 0 ? null : (
            <ThreadComponent
              isCurrentUser={
                this.props.madeByUser === this.props.currentUser.ID
              }
              listKey={this.props.number}
              isAssignment={this.props.type === 'assignment'}
              Comments={this.props.Comments}
            />
          )}
        </View>
      </View>
    );
  }
  localStyles = StyleSheet.create({
    containerView: {
      width:
        this.props.type == 'assignment'
          ? (2.4 * screenWidth) / 3
          : (2 * screenWidth) / 3,
      alignSelf:
        this.props.madeByUser == this.props.currentUser.ID
          ? 'flex-end'
          : 'flex-start',
      flexDirection:
        this.props.madeByUser == this.props.currentUser.ID
          ? 'row-reverse'
          : 'row',
      marginTop: this.props.number == 0 ? screenHeight / 40 : 0,
      marginBottom: screenHeight / 40
    },
    assignmentContainer: {
      alignSelf: 'center',
      flex: 3,
      overflow: 'hidden',
      borderColor: colors.lightBrown,
      borderWidth: 2,
      marginTop: screenHeight / 163.2,
      width: screenWidth / 1.6
    },
    spinnerContainerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    contentText: {
      color: colors.lightBrown,
      fontWeight: 'bold',
      padding: screenScale * 2,
      fontSize: fontScale * 15
    },
    userImage: {
      width: screenScale * 18,
      height: screenScale * 18,
      marginLeft:
        this.props.madeByUser == this.props.currentUser.ID
          ? 0
          : screenWidth / 45,
      marginRight:
        this.props.madeByUser == this.props.currentUser.ID
          ? screenWidth / 45
          : 0,
      resizeMode: 'contain'
    },
    newAssignmentText: {
      fontSize: fontScale * 16,
      color: colors.lightBrown,
      fontWeight: 'bold'
    },
    newAssignmentTextContainer: {
      flexDirection: 'row'
    },
    addReaction: {
      alignItems: 'center',
      justifyContent: 'center',
      width: screenScale * 8,
      height: screenScale * 8,
      borderWidth: 1,
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
      borderRadius: (screenScale * 8) / 2,
      alignSelf: 'flex-end',
      position: 'relative',
      bottom: screenScale * 4,
      left: screenScale * 4
    },
    reactionView: {
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      flex: 1,
    },
    Reaction: {
      alignItems: 'center',
      width: screenScale * 16,
      height: screenScale * 8,
      borderWidth: 1,
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
      borderRadius: (screenScale * 8) / 2,
      alignSelf: 'flex-end',
      position: 'relative',
      bottom: screenScale * 4,
      left: screenScale * 4,
      paddingLeft: screenWidth / 200,
      paddingRight: screenWidth / 200,
      marginRight: screenWidth / 86
    },
    contentContainerView: {
      borderWidth: 2,
      marginTop: 0,
      flex: 5,
      paddingBottom:
        this.props.type === 'assignment' ? screenHeight / 163.5 : 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.lightBrown,
      backgroundColor: colors.white,
    }
  });
}

class QuranAssignmentView extends Component {
  render() {
    return (
      <View>
        <Text
          style={[
            this.localStyles.newAssignmentText,
            {
              marginLeft:
                this.props.madeByUser == this.props.currentUser.ID
                  ? 0
                  : screenWidth / 86,
              marginRight:
                this.props.madeByUser == this.props.currentUser.ID
                  ? screenWidth / 86
                  : 0,
            },
          ]}
        >
          {this.props.Content.assignmentType} from ayah{' '}
          {this.props.Content.start.ayah} to ayah {this.props.Content.end.ayah}
        </Text>
        {this.props.isLoading ? (
          <TouchableOpacity
            disabled={this.props.isTeacher}
            style={this.localStyles.assignmentContainer}
          >
            <View style={this.localStyles.spinnerContainerStyle}>
              <LoadingSpinner />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={this.props.isTeacher}
            style={this.localStyles.assignmentContainer}
          >
            <SurahHeader surahName={this.props.surahName} />
            {this.props.page}
          </TouchableOpacity>
        )}
        {this.props.madeByUser === this.props.currentUser.ID ? null : (
          <Text
            style={[
              this.localStyles.newAssignmentText,
              { alignSelf: 'flex-end', marginRight: screenWidth / 86 },
            ]}
          >
            Click To Open
          </Text>
        )}
      </View>
    );
  }
  localStyles = StyleSheet.create({
    assignmentContainer: {
      alignSelf: 'center',
      height: screenHeight / 6,
      overflow: 'hidden',
      borderColor: colors.lightBrown,
      borderWidth: 2,
      marginTop: screenHeight / 163.2,
      width: screenWidth / 1.6
    },
    spinnerContainerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    newAssignmentText: {
      fontSize: fontScale * 16,
      color: colors.lightBrown,
      flexWrap: 'nowrap',
      fontWeight: 'bold'
    },
  });
}
