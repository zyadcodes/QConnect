//The style that will be used for all screens through out the app to fix the flow
import colors from './colors';
import { Dimensions } from 'react-native';

export default {
    container: {
        flexDirection: 'column',
        backgroundColor: colors.lightGrey,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
}