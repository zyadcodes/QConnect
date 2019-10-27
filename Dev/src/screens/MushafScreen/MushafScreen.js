//Screen which will provide all of the possible settings for the user to click on
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import colors from 'config/colors';
import QcParentScreen from "screens/QcParentScreen";
import SelectionPage from './Components/SelectionPage';
import Swiper from 'react-native-swiper'
import { Icon } from 'react-native-elements';
import { compareOrder } from './Helpers/AyahsOrder'
import QcActionButton from 'components/QcActionButton'
import surahs from './Data/Surahs.json'
import strings from 'config/strings';
import fontStyles from 'config/fontStyles';
import FirebaseFunctions from 'config/FirebaseFunctions';

const noAyahSelected = {
    surah: 0,
    page: 0,
    ayah: 0
};

export default class MushafScreen extends QcParentScreen {

    lastPage = 604;

    state = {
        pages: ["604", "603", "602"],
        key: 1,
        index: 1,
        studentID: this.props.navigation.state.params.studentID,
        classID: this.props.navigation.state.params.classID,
        selectedAyahsStart: {
            surah: 0,
            page: this.lastPage,
            ayah: 0
        },
        selectedAyahsEnd: {
            surah: 0,
            page: this.lastPage,
            ayah: 0
        },
        selectionStarted: false,
        selectionCompleted: false,
        assignmentName: "",
        freeFormAssignment: false
    }

    updateAssignmentName() {
        const { selectedAyahsStart, selectedAyahsEnd } = this.state;
        if (selectedAyahsStart.surah === 0) {
            //no selection made
            //todo: make this an explicit flag
            return "";
        }

        desc = surahs[selectedAyahsStart.surah].tname + " (" + selectedAyahsStart.ayah

        if (selectedAyahsStart.surah === selectedAyahsEnd.surah) {
            if (selectedAyahsStart.ayah !== selectedAyahsEnd.ayah) {
                desc += " to " + selectedAyahsEnd.ayah
            }
        } else {
            desc += ") to " + surahs[selectedAyahsEnd.surah].tname + " (" + selectedAyahsEnd.ayah
        }

        let pageDesc = ") p. " + selectedAyahsEnd.page;
        if (selectedAyahsStart.page !== selectedAyahsEnd.page) {
            pageDesc = ") pp. " + selectedAyahsStart.page + " to " + selectedAyahsEnd.page
        }
        desc += pageDesc;

        this.setState({
            assignmentName: desc,
            freeFormAssignment: false
        });
    }

    //this is to update the assignment text without mapping it to a location in the mus7af
    // this is to allow teachers to enter free form assignemnts
    // for example: redo your last 3 assignments
    setFreeFormAssignmentName(freeFormAssignmentName) {
        this.setState({
            assignmentName: freeFormAssignmentName,
            freeFormAssignment: true
        })
    }

    renderItem(item, idx) {
        const itemInt = parseInt(item)
        return (
            <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }} key={idx}>
                <SelectionPage
                    page={itemInt}
                    onChangePage={this.onChangePage.bind(this)}
                    selectedAyahsStart={this.state.selectedAyahsStart}
                    selectedAyahsEnd={this.state.selectedAyahsEnd}
                    selectionStarted={this.state.selectionStarted}
                    selectionCompleted={this.state.selectionCompleted}

                    //callback when user taps on a single ayah to selects
                    //determines whether this would be the start of end of the selection
                    // and select ayahs in between
                    onSelectAyah={this.onSelectAyah.bind(this)}

                    //callback when user selects a range of ayahs (line an entire page or surah)
                    onSelectAyahs={this.onSelectAyahs.bind(this)}

                    onUpdateAssignmentName={(newAssignmentName) => this.setFreeFormAssignmentName(newAssignmentName)}
                />
            </View>
        )
    }

    onSelectAyah(selectedAyah) {
        const { selectedAyahsStart, selectedAyahsEnd, selectionCompleted, selectionStarted } = this.state;

        //if the user taps on the same selected aya again, turn off selection
        if (compareOrder(selectedAyahsStart, selectedAyahsEnd) === 0 &&
            compareOrder(selectedAyahsStart, selectedAyah) === 0) {
            this.setState({
                selectionStarted: false,
                selectionCompleted: false,
                selectedAyahsStart: noAyahSelected,
                selectedAyahsEnd: noAyahSelected,
            }, () => this.updateAssignmentName())
        }
        else if (!selectionStarted) {
            this.setState({
                selectionStarted: true,
                selectionCompleted: false,
                selectedAyahsStart: selectedAyah,
                selectedAyahsEnd: selectedAyah
            }, () => this.updateAssignmentName())
        } else if (!selectionCompleted) {
            this.setState(
                {
                    selectionStarted: false,
                    selectionCompleted: true,
                }
            )

            //Set the smallest number as the start, and the larger as the end
            if (compareOrder(selectedAyahsStart, selectedAyah) > 0) {
                this.setState({ selectedAyahsEnd: selectedAyah }, () => this.updateAssignmentName())
            } else {
                this.setState({ selectedAyahsStart: selectedAyah }, () => this.updateAssignmentName())
            }
        }
    }

    onSelectAyahs(firstAyah, lastAyah) {
        //Set the smallest number as the start, and the larger as the end
        if (compareOrder(firstAyah, lastAyah) > 0) {
            this.setState({ selectedAyahsStart: firstAyah },
                this.setState({
                    selectedAyahsEnd: lastAyah,
                    selectionStarted: false,
                    selectionCompleted: true
                },
                    () => this.updateAssignmentName()))
        } else {
            this.setState({ selectedAyahsStart: lastAyah, },
                this.setState({
                    selectedAyahsEnd: firstAyah,
                    selectionStarted: false,
                    selectionCompleted: true
                },
                    () => this.updateAssignmentName()))
        }
    }

    onChangePage(page, keepSelection) {
        let pageNumber = parseInt(page);
        let nextPage = parseInt(pageNumber) + 1;
        let curPage = parseInt(pageNumber);
        let prevPage = parseInt(pageNumber) - 1;
        let index = 1;

        //if we are in the first page, change render page 1, 2, and 3, and set current page to index 0 (page 1)
        //this way, users can't swipe left to previous page since there is no previous page
        if (pageNumber === 1) {
            //bug bug: there is a bug in swiper where if I set index to 0 (to indicate end of book), 
            // onIndexChanged is not called on the next swipe.
            // this is a temporary workaround until swiper bug is fixed or we find a better workaround.
            prevPage = pageNumber;
            curPage = pageNumber;
            nextPage = pageNumber + 1;
            index = 1;
        }
        //if we are in the last page, change render page 602, 603, and 604, and set current page to index 2 (page 604)
        //this way, users can't swipe right to next page, since there is no next page
        else if (pageNumber === 604) {
            //bug bug: there is a bug in swiper where if I set index to 0 (to indicate end of book), 
            // onIndexChanged is not called on the next swipe.
            // this is a temporary workaround until swiper bug is fixed or we find a better workaround.
            prevPage = pageNumber - 1;
            curPage = pageNumber;
            nextPage = pageNumber;
            index = 1;
        }

        //reset the selection state if we are passed a flag to do so
        let resetSelectionIfApplicable = {};
        if (keepSelection === false) {
            resetSelectionIfApplicable = {
                selectedAyahsStart: noAyahSelected,
                selectedAyahsEnd: noAyahSelected,
            }
        }
        //otherwise, set the current page to the middle screen (index = 1), and set previous and next screens to prev and next pages 
        this.setState({
            ...resetSelectionIfApplicable,
            pages: [nextPage.toString(), curPage.toString(), prevPage.toString()],
            index: index,
        }
        )
    }

    onPageChanged(idx) {
        //if swipe right, go to next page, unless we are in the last page.
        if (idx === this.state.index - 1 && parseInt(this.state.pages[0]) !== 604) {
            const newPages = this.state.pages.map(i => (parseInt(i) + 1).toString())
            this.setState({ pages: newPages, key: ((this.state.key + 1) % 2), index: 1 })
        }
        //if swipe right, go to previous page, unless we are in the first page
        else if (idx === this.state.index + 1 && parseInt(this.state.pages[2]) !== 1) {
            const newPages = this.state.pages.map(i => (parseInt(i) - 1).toString())
            this.setState({ pages: newPages, key: ((this.state.key + 1) % 2), index: 1 })
        }
    }

    onSaveAssignment() {
        const { classID, studentID, assignmentName } = this.state;
        if (assignmentName.trim() === "") {
            Alert.alert(strings.Whoops, strings.PleaseEnterAnAssignmentName);
        } else {
            this.props.navigation.state.params.onSaveAssignment(assignmentName, strings.Memorization);

            this.props.navigation.pop();
        }
    }

    render() {
        return (
            <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
                <Swiper
                    index={this.state.index}
                    containerStyle={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                    key={this.state.key}
                    prevButton={<Icon
                        color={colors.primaryDark}
                        size={35}
                        name={'angle-left'}
                        type="font-awesome" />}
                    nextButton={<Icon
                        color={colors.primaryDark}
                        size={35}
                        name={'angle-right'}
                        type="font-awesome" />}
                    loop={false}
                    showsButtons={true}
                    showsPagination={false}
                    onIndexChanged={(index) => this.onPageChanged(index)}>
                    {this.state.pages.map((item, idx) => this.renderItem(item, idx))}
                </Swiper>
                <View style={{ padding: 5 }}>
                    {
                        (this.state.selectedAyahsStart.surah > 0 || this.state.freeFormAssignment) ?
                            <Text style={fontStyles.mainTextStyleDarkGrey}>Assignment: {this.state.assignmentName}</Text>
                            : <View></View>
                    }
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 15
                }}>
                    <QcActionButton
                        text={strings.Save}
                        onPress={() => { this.onSaveAssignment() }} />
                    <QcActionButton
                        text={strings.Cancel}
                        onPress={() => this.props.navigation.pop()} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    ayahText: {
        padding: 5,
        textAlign: 'right',
        fontFamily: 'me_quran',
        fontSize: 30,
        color: colors.darkGrey
    }
})