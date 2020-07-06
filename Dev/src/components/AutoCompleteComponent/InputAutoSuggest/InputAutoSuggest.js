import { FlatList, View, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import React, { Component, useState, useReducer, useRef } from 'react';
import * as _ from 'lodash';
import SuggestionListItem from '../SuggestionListItem/SuggestionListItem';
import suggest from '../services/suggest';
import style from './InputAutoSuggestStyle'

const InputAutoSuggest = (props) => {
  const { staticData, itemFormat } = props;

  const data = suggest.searchForRelevant('', staticData || [], itemFormat);
  const [suggestedData, setData] = useState(data.suggest)
  const [value, setValue] = useState(props.assignment)
  const [id, setID] = useState('')

  let searchList = searchListMethod.bind(this);
  let renderItem = renderItemMethod.bind(this);
  let myTextInput = useRef(null);

  const onPressItem = (id: string, name: string, ename: string) => {
    // updater functions are preferred for transactional updates
    const { onDataSelectedChange } = props;
    const existingItem = { id, name, ename };
    setValue(name)
    setID(id)
    //props.onTextChanged({name, ename, id});

    onDataSelectedChange(existingItem);
    props.onSurahTap(name, ename, id);

    searchList;
    //myTextInput.focus();
  };

  keyExtractor = (item, index) => item.id + '';

  const searchListMethod = async (text) => {
    props.onTextChanged(text);

    const {
      keyPathRequestResult,
      itemFormat,
      apiEndpointSuggestData,
      onDataSelectedChange,
      staticData,
    } = props;
    setValue(text)
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
    setData(suggestData.suggest)
  }

  const renderItemMethod = ({ item, index }) => {
    const { itemTextStyle, itemTagStyle } = props;
    return (
      <SuggestionListItem
        textStyle={itemTextStyle}
        tagStyle={itemTagStyle}
        id={item.id}
        onPressItem={onPressItem}
        name={item.name}
        tags={item.tags}
        ename={item.ename}
      />
    );
  };

    const { inputStyle, flatListStyle } = props;
    return (
      <View style={style.container}>
        <TextInput
          style={[style.inputDefaultStyle, inputStyle]}
          value={value}
          clearButtonMode="while-editing"
          selectTextOnFocus
          autoCorrect={false}
          onChangeText={searchList}
          ref={myTextInput}
        />
        <FlatList
          style={[style.flatList, flatListStyle]}
          data={data}
          extraData={{value, suggestedData, id}}
          numColumns={4}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={10}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
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
    ename: 'ename',
    tags: [],
  },
};


export default InputAutoSuggest;
