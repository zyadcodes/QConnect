import React, { useState, useEffect } from 'react';
import { Modal, Text, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import QcActionButton from 'components/QcActionButton/QcActionButton'
import strings from 'config/strings';
import colors from 'config/colors';
import surahNames from 'config/surahNames';
import InputAutoSuggest from 'components/AutoCompleteComponent/InputAutoSuggest/InputAutoSuggest';
import fontStyles from 'config/fontStyles';
import MultiSwitch from "react-native-multi-switch";
import { screenWidth, screenHeight } from 'config/dimensions';
import styles from './AssignmentEntryComponentStyles'

export default AssignmentEntryComponent = (props) => {

    const [input, setInput] = useState("")
    const [type, setType] = useState("None")

    const onTextChange = (text) => {
        setInput(text);
    }

    useEffect(() => {
        onTextChange(input);
    }, [])

        return (
            <KeyboardAvoidingView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    presentationStyle="overFullScreen"
                    visible={props.visible}
                    onRequestClose={() => {
                    }}>
                    <View style={{ marginVertical: screenHeight * 0.073, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: screenHeight * 0.029 }}>
                        <View style={styles.modal}>
                            <Text style={fontStyles.mainTextStyleDarkGrey}>{strings.EnterAssignment}</Text>

                            <View style={styles.spacer}></View>
                            <InputAutoSuggest
                                staticData={surahNames}
                                onTextChanged={onTextChange.bind(this)}
                                onSurahTap={(name, ename, id) => props.onSubmit({name, ename, id})}
                                assignment={props.assignment === strings.None ? "" : props.assignment}
                                inputStyle={fontStyles.mainTextStyleBlack}
                                itemTextStyle={fontStyles.mainTextStyleDarkGrey}
                            />

                            {
                                props.assignmentType === true ? (
                                    <View>
                                        <View style={styles.spacer}></View>
                                        <MultiSwitch
                                            choiceSize={screenWidth * 0.25}
                                            onActivate={(index) => {
                                                const type = index === 0 ? strings.Reading : (index === 1 ? strings.Memorization : strings.Revision);
                                                setType(type)
                                            }}
                                            activeContainerStyle={[{
                                                marginVertical: screenHeight * 0.025,
                                                backgroundColor: colors.grey,
                                                borderRadius: screenWidth * 0.025,
                                            },
                                            {
                                                marginVertical: screenHeight * 0.025,
                                                backgroundColor: colors.green,
                                                borderRadius: screenWidth * 0.025,
                                            },
                                            {
                                                marginVertical: screenHeight * 0.025,
                                                backgroundColor: colors.darkishGrey,
                                                borderRadius: screenWidth * 0.025,
                                            },]}
                                            inactiveContainerStyle={[styles.inactiveAssignmentStyle, styles.inactiveAssignmentStyle, {
                                                marginVertical: screenHeight * 0.025,
                                                marginLeft: screenWidth * 0.005,
                                                borderRadius: screenWidth * 0.025,
                                            }]}>
                                            <Text style={fontStyles.smallTextStyleDarkGrey}>{strings.Reading}</Text>
                                            <Text style={fontStyles.smallTextStyleDarkGrey}>{strings.Memorization}</Text>
                                            <Text style={fontStyles.smallTextStyleDarkGrey}>{strings.Revision}</Text>
                                        </MultiSwitch>
                                    </View>
                                ) : (
                                        <View></View>
                                    )
                            }
                            <View style={{
                                flexDirection: "row-reverse",
                                marginBottom: 30
                            }}>
                                <QcActionButton
                                    text={strings.Submit}
                                    screen={props.screen}
                                    onPress={() => {
                                        props.assignmentType ? props.onSubmit(input, type) :
                                        props.onSubmit(input)
                                    }} />
                                <QcActionButton
                                    text={strings.Cancel}
                                    onPress={() => props.onCancel()} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        )
}
