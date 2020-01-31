import React from 'react';
import {
	View,
	Image,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	TouchableHighlight,
	TouchableOpacity
} from 'react-native';
import colors from 'config/colors';
import { Rating } from 'react-native-elements';
import strings from 'config/strings';
import studentImages from 'config/studentImages';
import QcParentScreen from 'screens/QcParentScreen';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from 'components/LoadingSpinner';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import {
	BarChart,
	PieChart,
	ProgressChart,
	ContributionGraph,
	StackedBarChart
} from 'react-native-chart-kit';
import { Icon } from 'react-native-elements';

class StudentProfileScreen extends QcParentScreen {
	state = {
		studentID: this.props.navigation.state.params.studentID,
		currentClass: this.props.navigation.state.params.currentClass,
		classID: this.props.navigation.state.params.classID,
		currentAssignment: '',
		classStudent: '',
		isDialogVisible: false,
		isLoading: true,
		hasCurrentAssignment: '',
		classesAttended: '',
		classesMissed: ''

	};

	//Sets the screen for firebase analytics & fetches the correct student from this class
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('Student Profile Screen', 'StudentProfileScreen');
		const { currentClass, studentID } = this.state;
		const student = await currentClass.students.find((eachStudent) => {
			return eachStudent.ID === studentID;
		});

		this.setState({
			classStudent: student,
			currentAssignment:
				student.currentAssignment === 'None' ? strings.NoAssignmentsYet : student.currentAssignment,
			isLoading: false,
			hasCurrentAssignment: student.currentAssignment === 'None' ? false : true,
			classesAttended: 
				student.classesAttended? student.classesAttended: '0',
			classesMissed:
				student.classesMissed? student.classesMissed: '0',
		});
	}

	setDialogueVisible(visible) {
		this.setState({ isDialogVisible: visible });
	}

	getRatingCaption() {
		let caption = strings.GetStarted;

		const { averageRating } = this.state.classStudent;

		if (averageRating > 4) {
			caption = strings.OutStanding;
		} else if (averageRating >= 3) {
			caption = strings.GreatJob;
		} else if (averageRating > 0) {
			caption = strings.PracticePerfect;
		}

		return caption;
	}

	editAssignment(assignmentName) {
		this.setState({
			currentAssignment: assignmentName
		});
	}

	//---------- main UI render ===============================
	render() {
		const {
			classStudent,
			isLoading,
			classID,
			studentID,
			hasCurrentAssignment,
			currentAssignment,
			classesAttended,
			classesMissed,
		} = this.state;
		let { assignmentHistory, averageRating, name } = classStudent;

		//Sorts the assignments by date completed
		if (classStudent) {
			assignmentHistory = assignmentHistory.reverse();
		}

		//If the screen is loading, a spinner will display
		if (isLoading === true) {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<LoadingSpinner isVisible={true} />
				</View>
			);
		}

		return (
			<QCView style={screenStyle.container}>
				<View style={styles.studentInfoContainer}>
					<View style={styles.profileInfo}>
						<View style={styles.profileInfoTop}>
							<View style={{ width: screenWidth * 0.24 }}></View>
							<View style={styles.profileInfoTopRight}>
								<Text numberOfLines={1} style={fontStyles.bigTextStyleBlack}>
									{name.toUpperCase()}
								</Text>
								<View style={{ flexDirection: 'row', height: 0.037 * screenHeight }}>
									<Rating readonly={true} startingValue={averageRating} imageSize={25} />
									<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
										<Text style={fontStyles.bigTextStyleDarkGrey}>
											{averageRating === 0 ? '' : parseFloat(averageRating).toFixed(1)}
										</Text>
									</View>
								</View>
								<Text style={fontStyles.mainTextStylePrimaryDark}>{this.getRatingCaption()}</Text>
							</View>
						</View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-end',
								marginRight: screenWidth * 0.02,
								marginHorizontal: screenHeight * 0.05
							}}>
							<TouchableHighlight
								onPress={() => {
									this.props.navigation.push('MushafScreen', {
										invokedFromProfileScreen: true,
										assignToAllClass: false,
										userID: this.props.navigation.state.params.userID,
										classID,
										studentID,
										imageID: classStudent.profileImageID,
										onSaveAssignment: this.editAssignment.bind(this),
										newAssignment: true
									});
								}}>
								<Text style={fontStyles.bigTextStylePrimaryDark}>{strings.AddAssignment}</Text>
							</TouchableHighlight>
						</View>
						<View style={styles.profileInfoBottom}>
							<View style={styles.profileInfoTopLeft}>
								<Image
									style={styles.profilePic}
									source={studentImages.images[classStudent.profileImageID]}
								/>
							</View>
							<View style={{flexDirection:'row',paddingTop: 20, justifyContent:"space-between"}}>
							<Text style={fontStyles.smallTextStyleBlack}>
							Classes attended: {classesAttended}</Text>
						</View>	
						<View style={{flexDirection:'row',paddingTop: 5, justifyContent:"space-between"}}>
						<Text style={fontStyles.smallTextStyleBlack}>
							Classes missed: {classesMissed}</Text>
							</View>				
						</View>
					</View>
					{this.state.classStudent.currentAssignments.length > 0 ? (
						<View
							style={{
								alignItems: 'center',
								marginLeft: screenWidth * 0.017,
								flexDirection: 'row',
								paddingTop: screenHeight * 0.007,
								paddingBottom: screenHeight * 0.019
							}}>
							<Icon name={'book-open-outline'} type='material-community' color={colors.darkGrey} />
							<Text style={[{ marginLeft: screenWidth * 0.017 }, fontStyles.mainTextStyleDarkGrey]}>
								{strings.CurrentAssignment.toUpperCase()}
							</Text>
						</View>
					) : (
						<View />
					)}
					<BarChart
						data={{
							labels: ['January', 'February', 'March', 'April', 'May', 'June'],
							datasets: [
								{
									data: [
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100
									]
								}
							]
						}}
						width={screenWidth}
						height={220}
						yAxisLabel='$'
						yAxisSuffix='k'
						chartConfig={{
							backgroundColor: '#e26a00',
							backgroundGradientFrom: '#fb8c00',
							backgroundGradientTo: '#ffa726',
							decimalPlaces: 2, // optional, defaults to 2dp
							color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							style: {
								borderRadius: 16
							},
							propsForDots: {
								r: '6',
								strokeWidth: '2',
								stroke: '#ffa726'
							}
						}}
						bezier
						style={{
							marginVertical: 8,
							borderRadius: 16
						}}
					/>
					<FlatList
						data={this.state.classStudent.currentAssignments}
						keyExtractor={(item, index) => item.name + index}
						renderItem={({ item, index }) => (
							<View
								style={[
									styles.currentAssignment,
									{
										backgroundColor:
											item.isReadyEnum === 'WORKING_ON_IT'
												? colors.workingOnItColorBrown
												: item.isReadyEnum === 'READY'
												? colors.green
												: colors.red
									}
								]}>
								<View style={styles.middleView}>
									<Text style={fontStyles.bigTextStyleBlack}>
										{item.type ? item.type : strings.Memorize}
									</Text>
									<Text style={[fontStyles.bigTextStyleBlack, { paddingTop: screenHeight * 0.04 }]}>
										{item.name.toUpperCase()}
									</Text>
								</View>
								<View
									style={{
										flexDirection: 'row',
										paddingLeft: screenWidth * 0.02,
										justifyContent: 'space-between'
									}}>
									<Text style={fontStyles.mainTextStylePrimaryDark}>
										{item.isReadyEnum === 'READY'
											? strings.Ready
											: item.isReadyEnum === 'WORKING_ON_IT'
											? strings.WorkingOnIt
											: strings.NeedHelp}
									</Text>
									<View
										style={{
											flexDirection: 'row',
											paddingRight: screenWidth * 0.02,
											justifyContent: 'space-between'
										}}>
										<TouchableHighlight
											onPress={() => {
												this.props.navigation.push('MushafScreen', {
													invokedFromProfileScreen: true,
													assignToAllClass: false,
													userID: this.props.navigation.state.params.userID,
													classID,
													studentID,
													assignmentLocation: item.location,
													assignmentType: item.type,
													assignmentName: item.name,
													imageID: classStudent.profileImageID,
													onSaveAssignment: this.editAssignment.bind(this)
												});
											}}>
											<Text style={fontStyles.mainTextStylePrimaryDark}>
												{strings.EditAssignment}
											</Text>
										</TouchableHighlight>
										<TouchableHighlight
											onPress={() =>
												this.props.navigation.push('EvaluationPage', {
													classID: classID,
													studentID: studentID,
													assignmentName: item.name,
													userID: this.props.navigation.state.params.userID,
													classStudent: classStudent,
													assignmentLocation: item.location,
													assignmentType: item.type,
													newAssignment: true,
													readOnly: false
												})
											}>
											<View style={{ paddingLeft: screenWidth * 0.02 }}>
												<Text style={fontStyles.mainTextStylePrimaryDark}>{strings.Grade}</Text>
											</View>
										</TouchableHighlight>
									</View>
								</View>
							</View>
						)}></FlatList>
					<View
						style={{
							alignItems: 'center',
							marginLeft: screenWidth * 0.017,
							flexDirection: 'row',
							paddingTop: screenHeight * 0.007,
							paddingBottom: screenHeight * 0.019
						}}>
						<Icon name={'history'} type='material-community' color={colors.darkGrey} />
						<Text style={[{ marginLeft: screenWidth * 0.017 }, fontStyles.mainTextStyleDarkGrey]}>
							{strings.PastAssignments.toUpperCase()}
						</Text>
					</View>
					<ScrollView style={styles.prevAssignments}>
						<FlatList
							data={assignmentHistory}
							keyExtractor={(item, index) => item.name + index}
							renderItem={({ item, index }) => (
								<TouchableOpacity
									onPress={() =>
										this.props.navigation.push('EvaluationPage', {
											classID: classID,
											studentID: studentID,
											classStudent: classStudent,
											assignmentName: item.name,
											completionDate: item.completionDate,
											rating: item.evaluation.rating,
											notes: item.evaluation.notes,
											improvementAreas: item.evaluation.improvementAreas,
											userID: this.props.navigation.state.params.userID,
											evaluationObject: item.evaluation,
											evaluationID: item.ID,
											readOnly: true,
											newAssignment: false
										})
									}>
									<View
										style={{ ...styles.prevAssignmentCard, minHeight: 0.1 * screenHeight }}
										key={index}>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}>
											<View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
												<Text style={fontStyles.smallTextStylePrimaryDark}>
													{item.completionDate}
												</Text>
											</View>
											<View style={{ alignItems: 'center', justifyContent: 'center', flex: 5 }}>
												<Text numberOfLines={1} style={fontStyles.mainTextStyleBlack}>
													{item.name}
												</Text>
											</View>
											<View
												style={{
													flex: 2,
													justifyContent: 'center',
													alignItems: 'flex-end',
													paddingLeft: screenWidth * 0.005
												}}>
												<Rating
													readonly={true}
													startingValue={item.evaluation.rating}
													imageSize={15}
												/>
											</View>
										</View>
										{item.evaluation.notes ? (
											<Text numberOfLines={2} style={fontStyles.mainTextStyleBlack}>
												{strings.NotesColon + item.evaluation.notes}
											</Text>
										) : (
											<View />
										)}
										{item.assignmentType !== undefined && item.assignmentType !== 'None' ? (
											<View
												style={{
													flexWrap: 'wrap',
													paddingTop: screenHeight * 0.005,
													justifyContent: 'flex-start',
													height: screenHeight * 0.03
												}}>
												<Text
													style={[
														styles.corner,
														{
															backgroundColor:
																item.assignmentType === strings.Reading
																	? colors.grey
																	: item.assignmentType === strings.Memorization
																	? colors.green
																	: colors.darkishGrey
														}
													]}>
													{item.assignmentType}
												</Text>
											</View>
										) : (
											<View></View>
										)}
										{item.evaluation.improvementAreas &&
										item.evaluation.improvementAreas.length > 0 ? (
											<View
												style={{
													flexDirection: 'row',
													paddingTop: screenHeight * 0.005,
													justifyContent: 'flex-start',
													height: screenHeight * 0.04
												}}>
												<Text style={[fontStyles.smallTextStyleBlack, { alignSelf: 'center' }]}>
													{strings.ImprovementAreas}
												</Text>
												{item.evaluation.improvementAreas.map((tag) => {
													return (
														<Text key={tag} style={styles.corner}>
															{tag}
														</Text>
													);
												})}
											</View>
										) : (
											<View style={{ height: 10 }}></View>
										)}
									</View>
								</TouchableOpacity>
							)}
						/>
					</ScrollView>
				</View>
			</QCView>
		);
	}
}

//styles for the entire page
const styles = StyleSheet.create({
	studentInfoContainer: {
		marginVertical: 0.005 * screenHeight,
		backgroundColor: colors.white,
		flex: 1,
		borderColor: colors.lightGrey,
		borderWidth: 1,
		justifyContent: 'flex-end'
	},
	currentAssignment: {
		justifyContent: 'flex-end',
		height: screenHeight * 0.16,
		borderWidth: 0.5,
		borderColor: colors.grey
	},
	middleView: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: screenHeight * 0.0112
	},
	profileInfo: {
		flexDirection: 'column',
		backgroundColor: colors.white,
		marginBottom: 0.001 * screenHeight,
		paddingBottom: screenHeight * 0.01
	},
	corner: {
		borderColor: '#D0D0D0',
		borderWidth: 1,
		borderRadius: screenHeight * 0.004,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: screenWidth * 0.012,
		marginRight: screenHeight * 0.012,
		marginVertical: screenHeight * 0.004
	},
	profileInfoTop: {
		paddingHorizontal: screenWidth * 0.024,
		paddingTop: screenHeight * 0.015,
		flexDirection: 'row'
	},
	profileInfoTopLeft: {
		flexDirection: 'column',
		marginLeft: 0.007 * screenWidth,
		marginTop: -0.097 * screenHeight,
		alignItems: 'center',
		width: 0.24 * screenWidth
	},
	profileInfoTopRight: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		paddingLeft: screenWidth * 0.05,
		paddingBottom: 0.007 * screenHeight
	},
	profileInfoBottom: {
		flexDirection: 'column',
		paddingHorizontal: 0.024 * screenWidth,
		paddingBottom: screenHeight * 0.02,
		borderBottomColor: colors.grey,
		borderBottomWidth: 1
	},
	profilePic: {
		width: 0.1 * screenHeight,
		height: 0.1 * screenHeight,
		borderRadius: 0.075 * screenHeight,
		paddingBottom: 0.015 * screenHeight
	},
	prevAssignments: {
		flexDirection: 'column',
		backgroundColor: colors.white,
		marginHorizontal: 0.017 * screenWidth
	},
	prevAssignmentCard: {
		flexDirection: 'column',
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1,
		paddingHorizontal: screenWidth * 0.007,
		paddingVertical: screenHeight * 0.005
	}
});

export default StudentProfileScreen;
