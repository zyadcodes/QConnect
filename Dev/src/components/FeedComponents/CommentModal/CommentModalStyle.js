import { StyleSheet } from "react-native";
import {screenHeight} from 'config/dimensions'

export default styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: '#f7f7f9',
        maxWidth: screenWidth * 0.9,
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    scrollViewStyle: { 
        flex: 1, 
        marginTop: screenHeight / 40 
    }
})