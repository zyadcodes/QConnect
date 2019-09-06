// Dimensions.js inside __mocks__ folder
import { View } from 'react-native';

"use strict";
const React = require('react');

const FadeInView = {
    get: jest.fn().mockReturnValue(<View></View>)
}
module.exports = FadeInView