import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import colors from 'config/colors'
import FontLoadingComponent from 'components/FontLoadingComponent/FontLoadingComponent';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import styles from './StudentCardStyle'

/*Class represents the student card that will show up in the list of students
*from the teachers view.
*Each card will have a student name, a profile picture for the student, and the student's
*current assignment.
*The card will also be able to be pressed which controls the color of the card (Student Status)
*/
export default StudentCard = (props) => {
        //The properties of the component.
        const { studentName, profilePic, currentAssignment, background, onPress, comp, compOnPress, status } = props;
        return (
            //The style of the card as a whole. Inside the card, you have the image,
            //student name, and student assignment
            <TouchableOpacity
                style={[styles.cardStyle, { backgroundColor: background }]}
                borderColor={colors.black}
                //The on press function is for when the teacher clicks the card, the color of it 
                //should change depending on the behavior (i.e attendance screen)
                onPress={() => { onPress() }}>
                <Image
                    style={styles.profilePicStyle}
                    source={profilePic} />
                <View
                    style={styles.infoStyle}>
                    {currentAssignment ? (
                        <View style={{ marginLeft: screenWidth * 0.05 }}>
                            <View style={{ marginBottom: screenWidth * 0.004 }}>
                                <Text numberOfLines={1} style={fontStyles.bigTextStyleDarkestGrey}>{studentName}</Text>
                            </View>
                            <View style={{ marginBottom: screenWidth * 0.004 }}>
                                <Text numberOfLines={1} style={[fontStyles.bigTextStyleDarkGrey, {textAlign: 'left'}]}>{currentAssignment}</Text>
                            </View>
                            <View style={{ marginBottom: screenHeight * 0.005 }}>
                                <Text style={fontStyles.mainTextStyleDarkGrey}>{status}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginLeft: screenWidth * 0.05 }}>
                                <Text numberOfLines={1} style={fontStyles.bigTextStyleBlack}>{studentName}</Text>
                            </View>
                        )}
                </View>
                {
                    comp ? (
                        <View style={styles.removeStudentStyle}>
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: screenHeight * 0.2,
                                width: screenWidth * 0.2
                            }}
                                onPress={() => { compOnPress() }}>
                                {comp}
                            </TouchableOpacity>
                        </View>
                    ) : (
                            <View style={styles.removeStudentStyle}></View>
                        )
                }

            </TouchableOpacity>
        );
}

/*
*Makes sure properties that are passed into component are valid. The student name must be a string,
*the source of the image must be a number, the current assignment is also a string, and the onPress
*must be a function
*/
StudentCard.propTypes = {
    studentName: PropTypes.string.isRequired,
    profilePic: PropTypes.number.isRequired,
    currentAssignment: PropTypes.string,
    onPress: PropTypes.func.isRequired,
}

