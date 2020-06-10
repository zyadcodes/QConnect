import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const screenScale = Dimensions.get('window').scale;
const fontScale = Dimensions.get('window').fontScale;

export { screenHeight, screenWidth, screenScale, fontScale };