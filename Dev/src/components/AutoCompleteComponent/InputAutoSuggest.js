
import {
  FlatList, View, TextInput, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as _ from 'lodash';
import SuggestionListItem from './SuggestionListItem';
import suggest from './services/suggest';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/fontStyles';
import { colors } from 'react-native-elements';


let style;

class InputAutoSuggest extends Component {
  constructor(props) {
    super(props);
    const { staticData, itemFormat } = this.props;
    
    const data = suggest.searchForRelevant('', staticData || [], itemFormat);
    this.state = { data: data.suggest, value: this.props.assignment };

    this.searchList = this.searchList.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onPressItem = (id: string, name: string) => {
    // updater functions are preferred for transactional updates
    const { onDataSelectedChange } = this.props;
    const existingItem = { id, name };
    this.setState({
      value: name,
      id: id
    });
    this.props.onTextChanged({name, id});

    onDataSelectedChange(existingItem);
    
    //this.searchList;
    this.myTextInput.focus();
  };
  
  keyExtractor = (item, index) => item.id+"";

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
        suggestData = !text ? staticData : suggest.searchForRelevant(text, staticData, itemFormat);
      } catch (e) {
        suggestData = { suggest: [], existingItem: null };
      }
    } else {
      try {
        suggestData = await suggest.searchForSuggest(
          text,
          apiEndpointSuggestData,
          keyPathRequestResult,
          itemFormat,
        );
      } catch (e) {
        suggestData = { suggest: [], existingItem: null };
      }
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
      />
    );
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
          autoCorrect={false}
          onChangeText={this.searchList}
          ref={(ref)=>{this.myTextInput = ref}}
        />
        <FlatList
          style={[style.flatList, flatListStyle]}
          data={data}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          initialNumToRender = {10}
          keyboardShouldPersistTaps = "handled"
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
  keyPathRequestResult: 'suggest.city[0].options',
  itemFormat: {
    id: 'id',
    name: 'name',
    tags: [],
  },
};

style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: 300,
    height: 200
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
  },
  itemTextStyle: fontStyles.bigTextStylePrimaryDark,
});

export default InputAutoSuggest;
