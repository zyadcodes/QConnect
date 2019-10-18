import React from 'react';
import { Modal, Text, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import QcActionButton from 'components/QcActionButton'
import strings from 'config/strings';
import colors from 'config/colors';
import surahNames from 'config/surahNames';
import InputAutoSuggest from 'components/AutoCompleteComponent/InputAutoSuggest'
import fontStyles from 'config/fontStyles';

export default class AssignmentEntryComponent extends React.Component {

    state = {
        input: ""
    }

    onTextChange(text) {
        this.setState({ input: text });
    }

    componentDidMount() {
        this.onTextChange(this.state.input);
    }

    render() {
        return (
            <KeyboardAvoidingView>
            <Modal
                animationType="fade"
                transparent={true}
                presentationStyle="overFullScreen"
                visible={this.props.visible}
                onRequestClose={() => {
                }}>
                <View style={{ marginVertical: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                    <View style={styles.modal}>
                        <Text style={fontStyles.mainTextStyleDarkGrey}>{strings.EnterAssignment}</Text>

                        <View style={styles.spacer}></View>
                        <InputAutoSuggest
                            staticData={surahNames}
                            onTextChanged={this.onTextChange.bind(this)}
                            assignment={this.props.assignment === strings.None? "" : this.props.assignment }
                            inputStyle={fontStyles.mainTextStyleDarkGrey}
                            itemTextStyle={fontStyles.mainTextStyleDarkGrey}
                        />

                        <View style={{
                            flexDirection: "row-reverse"
                        }}>
                            <QcActionButton
                                text={strings.Submit}
                                screen={this.props.screen}
                                onPress={() => {
                                    this.props.onSubmit(this.state.input)
                                }} />
                            <QcActionButton
                                text={strings.Cancel}
                                onPress={() => this.props.onCancel()} />
                        </View>
                    </View>
                </View>
            </Modal>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: colors.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: screenHeight * 0.03,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.grey,
        borderBottomWidth: 1,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 2,
        marginLeft: 45,
        marginRight: 45,
        paddingRight: 5,
        paddingLeft: 5
    },
    spacer: {
        height: screenHeight * 0.01
    }
});