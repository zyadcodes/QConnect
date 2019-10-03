//The style that will be used for all screens through out the app to fix the flow
import colors from './colors';
import { screenHeight, screenWidth } from 'config/dimensions';

export default {
    container: {
        flexDirection: 'column',
        backgroundColor: colors.lightGrey,
        width: screenWidth,
        height: screenHeight
    }
}