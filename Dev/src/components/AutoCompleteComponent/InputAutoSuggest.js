import {
  FlatList,
  View,
  TextInput,
  StyleSheet,
  Text,
  Switch,
} from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import * as _ from "lodash";
import SuggestionListItem from "./SuggestionListItem";
import suggest from "./services/suggest";
import { screenWidth, screenHeight } from "config/dimensions";
import fontStyles from "config/fontStyles";
import ourColors from "config/colors";
import { colors } from "react-native-elements";
import strings from "config/strings";

let style;

class InputAutoSuggest extends Component {
  constructor(props) {
    super(props);
    const { staticData, itemFormat } = this.props;
    const data = suggest.searchForRelevant("", staticData || [], itemFormat);
    this.state = {
      data: data.suggest,
      value: this.props.assignment,
      staticData,
      ascending: true,
    };
    this.searchList = this.searchList.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const { staticData, itemFormat } = props;
    //if improvement areas have changed from the calling screen, let's reflect that here.
    //this is a quick way to check if the arrays have the same content
    // if (!_.isEmpty(_.xor(staticData, state.staticData))) {
    let data = suggest.searchForRelevant("", staticData || [], itemFormat);
    return {
      data: data.suggest,
      staticData,
    };
    // }
    return null;
  }

  onPressItem = (id: string, name: string, ename: string) => {
    // updater functions are preferred for transactional updates
    const { onDataSelectedChange } = this.props;
    const existingItem = { id, name, ename };
    this.setState({
      value: name,
      id: id,
    });
    //this.props.onTextChanged({name, ename, id});

    onDataSelectedChange(existingItem);
    this.props.onSurahTap(name, ename, id);

    this.searchList;
    //this.myTextInput.focus();
  };

  keyExtractor = (item, index) => item.id + "";

  async searchList(text) {
    this.props.onTextChanged(text);

    const {
      keyPathRequestResult,
      itemFormat,
      apiEndpointSuggestData,
      onDataSelectedChange,
      staticData,
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
      data: suggestData.suggest,
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
  toggleOrder = () => {
    const reverseData = this.state.staticData.reverse();
    let data = suggest.searchForRelevant(
      "",
      reverseData || [],
      this.props.itemFormat
    );
    this.setState({
      data: data.suggest,
      ascending: !this.state.ascending,
    });
  };
  render() {
    const { value, data } = this.state;
    const { inputStyle, flatListStyle } = this.props;
    return (
      <View style={style.container}>
        <TextInput
          style={[style.inputDefaultStyle, inputStyle]}
          value={value}
          clearButtonMode="while-editing"
          selectTextOnFocus
          autoCorrect={false}
          onChangeText={this.searchList}
          ref={(ref) => {
            this.myTextInput = ref;
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text
            onPress={() => this.toggleOrder()}
            style={fontStyles.smallTextStylePrimaryDark}
          >
            {this.state.ascending ? strings.Ascending : strings.Descending}
          </Text>

          <Switch
            onValueChange={() => this.toggleOrder()}
            value={this.state.ascending}
            style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
            trackColor={{ true: ourColors.darkGreen, false: ourColors.darkRed }}
          />
        </View>
        <FlatList
          style={[style.flatList, flatListStyle]}
          data={data}
          extraData={this.state}
          numColumns={4}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          initialNumToRender={10}
          keyboardShouldPersistTaps="handled"
        />
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
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
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
    tags: [],
  },
};

style = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: screenWidth * 0.9,
    height: screenHeight * 0.9,
  },
  input: {
    fontSize: 22,
    borderBottomWidth: 1,
  },
  flatList: {},
  inputDefaultStyle: {
    height: screenHeight * 0.08,
    marginVertical: screenHeight * 0.01,
    color: colors.darkGrey,
    backgroundColor: colors.black,
    borderBottomColor: colors.darkGrey,
    borderBottomWidth: 1,
    textAlign: "right",
    paddingTop: 10,
  },
  itemTextStyle: fontStyles.bigTextStylePrimaryDark,
});

export default InputAutoSuggest;
