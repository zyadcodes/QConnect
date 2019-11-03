//Screen which will provide all of the possible settings for the user to click on
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import LoadingSpinner from 'components/LoadingSpinner';
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
import studentImages from 'config/studentImages';
import classImages from "config/classImages";
import { screenHeight, screenWidth } from 'config/dimensions';


//------- constants to indicate the case when there is no ayah selected 
const noAyahSelected = {
    surah: 0,
    page: 0,
    ayah: 0
};

const noSelection = {
    start: noAyahSelected,
    end: noAyahSelected,
    started: false,
    completed: false
}


//-------- MushafScreen: container component for the screen holding Mushaf pages ------
// Implements pagination through a swiper component with a fixed width: 3 screens
// swiping screens back and forth changes the loaded pages but keeps the set to 3 screens and the loaded page as the middle screen
// this way a user can always swipe left and right
// Todo: currently the first and last screen of the mushhaf have a hack since they deviate from this paradigm. Need to fix later on.
export default class MushafScreen extends QcParentScreen {

    //------------------------ initial state ----------------------------
    lastPage = 604;
    state = {
        pages: ["604", "603", "602"],
        key: 1,
        index: 1,
        classID: this.props.navigation.state.params.classID,
        studentID: this.props.navigation.state.params.studentID,
        imageID: this.props.navigation.state.params.imageID,
        assignToAllClass: this.props.navigation.state.params.assignToAllClass,
        selection: {
            started: false,
            completed: false,
            start: {
                surah: 0,
                page: this.lastPage,
                ayah: 0
            },
            end: {
                surah: 0,
                page: this.lastPage,
                ayah: 0
            }
        },
        assignmentName: "",
        assignmentType: strings.Memorization,
        freeFormAssignment: false,
        invokedFromProfileScreen: false,
        isLoading: true
    }

    async componentDidMount() {
        FirebaseFunctions.setCurrentScreen("MushhafAssignmentScreen", "MushhafAssignmentScreen");
        const { studentID, invokedFromProfileScreen, assignmentType, assignmentLocation, assignmentName } = this.props.navigation.state.params;

        // if the page was invoked from the student profile screen, we need to go back (pop) when done, 
        // otherwise, we need to reload the teacher main screen when done
        if (invokedFromProfileScreen === true) {
            this.setState({
                invokedFromProfileScreen: true
            })
        }

        const { userID } = this.props.navigation.state.params;
        const teacher = await FirebaseFunctions.getTeacherByID(userID);
        const { currentClassID } = teacher;
        const currentClass = await FirebaseFunctions.getClassByID(currentClassID);

        if (studentID === undefined) {

            //assign to all class -----
            this.setState({
                selection: {
                    start: currentClass.currentAssignmentLocation ? currentClass.currentAssignmentLocation.start : noAyahSelected,
                    end: currentClass.currentAssignmentLocation ? currentClass.currentAssignmentLocation.end : noAyahSelected,
                    started: false,
                    completed: currentClass.currentAssignmentLocation ? true : false,
                },
                assignToAllClass: true,
                userID,
                imageID: currentClass.classImageID,
                classID: currentClassID,
                currentClass: currentClass,
                assignmentName: currentClass.currentAssignment,
                assignmentType: currentClass.currentAssignmentType
            },
                () => {
                    if (currentClass.currentAssignmentLocation !== undefined) {
                        let newPage = currentClass.currentAssignmentLocation.start.page;
                        this.onChangePage(newPage, true);
                    }
                    this.setState({isLoading: false});
                });
        }
        else {
            // assign to a particular student ----------
            let pagesSection = {};
            if(assignmentLocation !== undefined){
                let newPage = assignmentLocation.start.page;
                pages = this.getPagesToLoad(newPage);
                pagesSection = {
                    pages: pages.pages,
                    index: pages.index
                }
            }
            
            this.setState(
                {
                    ...pagesSection,
                    isLoading: false,
                    assignToAllClass: false,
                    currentClass: currentClass,
                    studentID: studentID,
                    selection: assignmentLocation? {
                        start: assignmentLocation.start,
                        end: assignmentLocation.end,
                        started: false,
                        completed: true
                    } : noSelection,
                    assignmentName,
                    assignmentType: assignmentType !== undefined? assignmentType : strings.Memorization,
                }); 
        }
    }

    // ------------------------- Helpers and Getters  --------------------------------------
    getPagesToLoad(page){
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

        return {pages: [nextPage.toString(), curPage.toString(), prevPage.toString()], index: index}; 
    }

    // ------------------------- Event handlers --------------------------------------------

    //this is to update the assignment text without mapping it to a location in the mus7af
    // this is to allow teachers to enter free form assignemnts
    // for example: redo your last 3 assignments
    setFreeFormAssignmentName(freeFormAssignmentName) {
        this.setState({
            assignmentName: freeFormAssignmentName,
            freeFormAssignment: true
        })
    }

    onSelectAyah(selectedAyah) {
        const { selection } = this.state;

        //if the user taps on the same selected aya again, turn off selection
        if (compareOrder(selection.start, selection.end) === 0 &&
            compareOrder(selection.start, selectedAyah) === 0) {
            this.setState({ selection: noSelection }, () => this.updateAssignmentName())
        }
        else if (!selection.started) {
            this.setState({
                selection: {
                    started: true,
                    completed: false,
                    start: selectedAyah,
                    end: selectedAyah
                }
            }, () => this.updateAssignmentName())
        } else if (!selection.completed) {
            this.setState(
                {
                    selection: {
                        ...this.state.selection,
                        started: false,
                        completed: true
                    }
                },
                () => {
                    //Set the smallest number as the start, and the larger as the end
                    if (compareOrder(selection.start, selectedAyah) > 0) {
                        this.setState({ selection: { ...this.state.selection, end: selectedAyah } }, () => this.updateAssignmentName())
                    } else {
                        this.setState({ selection: { ...this.state.selection, start: selectedAyah } }, () => this.updateAssignmentName())
                    }
                }
            )
        }
    }

    updateAssignmentName() {
        const { selection } = this.state;
        if (selection.start.surah === 0) {
            //no selection made
            //todo: make this an explicit flag
            return "";
        }

        desc = surahs[selection.start.surah].tname + " (" + selection.start.ayah

        if (selection.start.surah === selection.end.surah) {
            if (selection.start.ayah !== selection.end.ayah) {
                desc += strings.To + selection.end.ayah
            }
        } else {
            desc += ")" + strings.To + surahs[selection.end.surah].tname + " (" + selection.end.ayah
        }

        let pageDesc = strings.ParenthesisPage + selection.end.page;
        if (selection.start.page !== selection.end.page) {
            pageDesc = strings.PagesWithParenthesis + selection.start.page + strings.To + selection.end.page
        }
        desc += pageDesc;

        this.setState({
            assignmentName: desc,
            freeFormAssignment: false
        });
    }

    // ---- selects a range of ayahs   -----
    onSelectAyahs(firstAyah, lastAyah) {
        let startA = firstAyah;
        let endA = lastAyah;

        //Set the smallest number as the start, and the larger as the end
        if (compareOrder(firstAyah, lastAyah) <= 0) {
            startA = lastAyah;
            endA = firstAyah;
        }

        this.setState((prevState) => {
            return {
                selection: {
                    ...prevState.selection,
                    start: startA
                }
            }
        }, () => this.setState((prevState2) => {
            return {
                selection: {
                    ...prevState2.selection,
                    started: false,
                    completed: true,
                    end: endA
                }
            };
        },
            () => this.updateAssignmentName()));
    }

    onChangePage(page, keepSelection) {
        //reset the selection state if we are passed a flag to do so
        let resetSelectionIfApplicable = {};
        if (keepSelection === false) {
            resetSelectionIfApplicable = {
                selection: noSelection
            }
        }

        let pages = this.getPagesToLoad(page);
        //otherwise, set the current page to the middle screen (index = 1), and set previous and next screens to prev and next pages 
        this.setState({
            ...resetSelectionIfApplicable,
            pages: pages.pages,
            index: pages.index,
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

    /**
     * studentID: this.props.navigation.state.params.studentID,
        classID: this.props.navigation.state.params.classID,
        assignToAllClass: this.props.navigation.state.params.assignToAllClass,
     */
    onChangeAssignee(id, imageID, isClassID) {
        if (isClassID === true) {
            this.setState({
                classID: id,
                assignToAllClass: true,
                imageID: imageID
            }
            )
        } else {
            this.setState({
                studentID: id,
                assignToAllClass: false,
                imageID: imageID
            }
            )
        }
    }

    async saveClassAssignment(newAssignmentName) {
        const { classID, assignmentType, currentClass, selection } = this.state;
        let assignmentLocation = { start: selection.start, end: selection.end };

        await FirebaseFunctions.updateClassAssignment(classID, newAssignmentName, assignmentType, assignmentLocation);

        //since there might be a latency before firebase returns the updated assignments, 
        //let's save them here and later pass them to the calling screen so that it can update its state without
        //relying on the Firebase async latency
        let students = currentClass.students.map((student) => {
            student.currentAssignment = newAssignmentName;
            student.assignmentLocation = assignmentLocation;
        })
        let updatedClass = {
            ...currentClass,
            students
        }

        this.setState({
            currentClass: updatedClass
        });
    }

    //method updates the current assignment of the student
    saveStudentAssignment(newAssignmentName) {

        const { classID, studentID, assignmentType, selection, currentClass } = this.state;
        let assignmentLocation = { start: selection.start, end: selection.end };

        //update the current class object (so we can pass it to caller without having to re-render fron firebase)
        let students = currentClass.students.map((student) => {
            if(student.ID === studentID){
                student.currentAssignment = newAssignmentName;
                student.assignmentLocation = assignmentLocation;
            }
            return student; 
        })

        let updatedClass = {
            ...currentClass,
            students
        }

        this.setState({
            currentClass: updatedClass
        });

        FirebaseFunctions.updateStudentCurrentAssignment(classID, studentID, newAssignmentName, assignmentType, assignmentLocation);
    }

    onSaveAssignment() {
        const { assignmentName, assignToAllClass } = this.state;
        if (assignmentName.trim() === "") {
            Alert.alert(strings.Whoops, strings.PleaseEnterAnAssignmentName);
        } else {
            if (assignToAllClass) {
                this.saveClassAssignment(assignmentName);

            } else {
                this.saveStudentAssignment(assignmentName);

            }

            this.closeScreen();
        }
    }

    closeScreen() {
        const { invokedFromProfileScreen, userID, assignmentName, currentClass } = this.state;

        //go back to student profile screen if invoked from there, otherwise go back to main screen
        if (invokedFromProfileScreen) {

            if(assignmentName && assignmentName.trim().length > 0){
                //update the caller screen with the new assignment then close
                this.props.navigation.state.params.onSaveAssignment(assignmentName);
            }
            this.props.navigation.pop();
        } else {
            this.props.navigation.push("TeacherCurrentClass", { userID, currentClass });
        }
    }

    // ------------------------ Render the Mushhaf Component ----------------------------------------
    renderItem(item, idx) {
        const { imageID, assignToAllClass, assignmentType, selection, classID, studentID } = this.state;

        const itemInt = parseInt(item)
        profileImage = isNaN(imageID) ? undefined :
            assignToAllClass ? classImages.images[imageID] : studentImages.images[imageID];

        return (
            <View style={{ width: screenWidth, height: screenHeight }} key={idx}>
                <SelectionPage
                    page={itemInt}
                    onChangePage={this.onChangePage.bind(this)}
                    selectedAyahsStart={selection.start}
                    selectedAyahsEnd={selection.end}
                    selectionStarted={selection.started}
                    selectionCompleted={selection.completed}
                    profileImage={profileImage}
                    currentClass={this.state.currentClass}
                    assignmentType={assignmentType}
                    assignToID={assignToAllClass ? classID : studentID}
                    onChangeAssignee={(id, imageID, isClassID) => this.onChangeAssignee(id, imageID, isClassID)}
                    onChangeAssignmentType={(value) => this.setState({ assignmentType: value })}

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

    render() {
        const { isLoading } = this.state;

        if (isLoading === true) {
            return (
                <View id={this.state.page + "spinner"} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )
        } else {

            return (
                <View style={{ width: screenWidth, height: screenHeight }}>
                    <Swiper
                        index={this.state.index}
                        containerStyle={{ width: screenWidth, height: screenHeight }}
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
                            (this.state.selection.start.surah > 0 || this.state.freeFormAssignment) ?
                                <Text style={fontStyles.mainTextStyleDarkGrey}>{this.state.assignmentName}</Text>
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
                            onPress={() => this.closeScreen()} />
                    </View>
                </View>
            );
        }
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