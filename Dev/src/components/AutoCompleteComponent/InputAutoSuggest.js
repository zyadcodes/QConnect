import { FlatList, View, Platform, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import * as _ from "lodash";
import SuggestionListItem from "./SuggestionListItem";
import suggest from "./services/suggest";
import { screenWidth, screenHeight } from "config/dimensions";
import fontStyles from "config/fontStyles";
import colors from "config/colors";
import QcTextInput from "components/QcTextInput";
import strings from "config/strings";
import { Icon } from "react-native-elements";

class InputAutoSuggest extends Component {
  constructor(props) {
    super(props);
    const { staticData, itemFormat } = this.props;

    const data = suggest.searchForRelevant("", staticData || [], itemFormat);
    this.state = { data: data.suggest, value: this.props.assignment };

    this.searchList = this.searchList.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onPressItem = (id, name, ename) => {
    // updater functions are preferred for transactional updates
    const { onDataSelectedChange } = this.props;
    const existingItem = { id, name, ename };
    this.setState({
      value: name,
      id: id
    });
    //this.props.onTextChanged({name, ename, id});

    onDataSelectedChange(existingItem);
    this.props.onSurahTap(name, ename, id);

    this.searchList;
  };

  keyExtractor = (item, index) => item.id + "";

  async searchList(text) {
    this.props.onTextChanged(text);

    const {
      keyPathRequestResult,
      itemFormat,
      apiEndpointSuggestData,
      onDataSelectedChange,
      staticData
    } = this.props;
    this.setState({ value: text });
    let suggestData = null;
    if (staticData != null) {
      try {
        suggestData =
          !text || text.length === 0
            ? staticData
            : suggest.searchForRelevant(text, staticData, itemFormat);
      } catch (e) {
        suggestData = { suggest: [], existingItem: null };
      }
    } else {
      try {
        suggestData = await suggest.searchForSuggest(
          text,
          apiEndpointSuggestData,
          keyPathRequestResult,
          itemFormat
        );
      } catch (e) {
        suggestData = { suggest: [], existingItem: null };
      }
    }
    if (suggestData.suggest === undefined) {
      suggestData = suggest.searchForRelevant("", staticData || [], itemFormat);
    }
    onDataSelectedChange(suggestData.existingItem);
    this.setState({
      data: suggestData.suggest
    });
  }

  renderItem = ({ item, index }) => {
    const { itemTextStyle, itemTagStyle } = this.props;
    return (
      <SuggestionListItem
        textStyle={itemTextStyle}
        tagStyle={itemTagStyle}
        id={item.id}
        onPressItem={this.onPressItem}
        name={item.name}
        tags={item.tags}
        ename={item.ename}
      />
    );
  };

  renderTextInput(inputStyle, value) {
    return (
      <View style={styles.footerRow}>
        <QcTextInput
          style={[styles.inputDefaultStyle, inputStyle]}
          placeholder={strings.TypeSurahName}
          value={value}
          clearButtonMode="while-editing"
          selectTextOnFocus
          autoCorrect={false}
          onChangeText={this.searchList}
        />
      </View>
    );
  }

  render() {
    const { value, data } = this.state;
    const { style, inputStyle, flatListStyle } = this.props;
    return (
      <View style={[styles.container, style]}>
        {//due to the difference in behavior of keyborad padding in ios vs android
        // we will bring textInput to the bottom of the layout for Android and keep it
        // to avoid it temporarily padding off top of the screen
        // we will keep text input on top for iOS since this problem doesn't exist
        // and it offers a simpler / cleaner UI there.
        Platform.OS !== "android" && this.renderTextInput(inputStyle, value)}
        <FlatList
          style={[styles.flatList, flatListStyle]}
          data={data}
          extraData={this.state}
          numColumns={4}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          columnWrapperStyle={styles.reverseColumns}
          initialNumToRender={10}
          keyboardShouldPersistTaps="handled"
        />
        {//due to the difference in behavior of keyborad padding in ios vs android
        // we will bring textInput to the bottom of the layout for Android and keep it
        // to avoid it temporarily padding off top of the screen
        // we will keep text input on top for iOS since this problem doesn't exist
        // and it offers a simpler / cleaner UI there.
        Platform.OS === "android" && this.renderTextInput(inputStyle, value)}
      </View>
    );
  }
}
InputAutoSuggest.propTypes = {
  inputStyle: PropTypes.shape({}),
  flatListStyle: PropTypes.shape({}),
  itemTextStyle: PropTypes.shape({}),
  itemTagStyle: PropTypes.shape({}),
  apiEndpointSuggestData: PropTypes.func,

  staticData: PropTypes.arrayOf(PropTypes.shape({})),
  onDataSelectedChange: PropTypes.func,
  onTextChanged: PropTypes.func,
  keyPathRequestResult: PropTypes.string,
  itemFormat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string)
  })
};
InputAutoSuggest.defaultProps = {
  inputStyle: {},
  flatListStyle: {},
  itemTextStyle: { fontSize: 25 },
  itemTagStyle: { fontSize: 22 },
  staticData: null,
  apiEndpointSuggestData: () => _.noop,
  onDataSelectedChange: () => _.noop,
  keyPathRequestResult: "suggest.city[0].options",
  itemFormat: {
    id: "id",
    name: "name",
    ename: "ename",
    tags: []
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0
  },
  reverseColumns: {
    flexDirection: "row-reverse"
  },
  input: {
    fontSize: 22,
    borderBottomWidth: 1
  },
  flatList: {},
  inputDefaultStyle: {
    marginVertical: screenHeight * 0.01,
    color: colors.darkGrey,
    backgroundColor: colors.lightGrey,
    borderBottomColor: colors.darkGrey,
    borderBottomWidth: 1,
    textAlign: "right",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  itemTextStyle: fontStyles.bigTextStylePrimaryDark,
  footerRow: {
    flexDirection: "row",
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default InputAutoSuggest;
