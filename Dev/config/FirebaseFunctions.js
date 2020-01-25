//This class will contain all the functions that interact with the react native firebase
//library
import firebase from 'react-native-firebase';
import strings from './strings';

export default class FirebaseFunctions {
	//References that'll be used throughout the class's static functions
	static database = firebase.firestore();
	static batch = this.database.batch();
	static storage = firebase.storage();
	static teachers = this.database.collection('teachers');
	static students = this.database.collection('students');
	static classes = this.database.collection('classes');
	static functions = firebase.functions();
	static fcm = firebase.messaging();
	static auth = firebase.auth();
	static analytics = firebase.analytics();

	/*static async migrate() {
		const allClasses = await this.classes.get();
		const allClassesDocs = await allClasses.docs.map((doc) => doc.data());
		for (const c of allClassesDocs) {
			if (c.ID && c.ID !== 'Example ID') {
				const students = c.students;
				const newArray = [];
				for (let student of students) {
					if (student.currentAssignment !== 'None') {
						let newCurrentAssignments = [{
							name: student.currentAssignment,
							location: student.currentAssignmentLocation,
							type: student.currentAssignmentType,
							isReadyEnum: student.isReadyEnum
						}];
						student.currentAssignments = newCurrentAssignments;
					}
					newArray.push(student);
				}
				await this.updateClassObject(c.ID, {
					students: students
				});
			}
		}
		return 0;
	}*/

	//Methods that can be called from any other class

	//This functions will take in an email and a password & will sign a user up using
	//firebase authentication (will also sign the user in). Additionally, it will take
	//in a boolean to determine whether this is a student or a teacher account. Based
	//on that info, it will call another function to create the designated account object
	//for this account (with the same ID). The function returns that ID
	static async signUp(email, password, isTeacher, accountObject) {
		let account = await this.auth.createUserWithEmailAndPassword(email, password);
		//Creates the firestore object with an ID that matches this one
		let ID = account.user.uid;
		//Suscribes to the topic so that any  notifications sent to this user are recieved to the phone
		this.fcm.subscribeToTopic(ID);
		accountObject.ID = ID;
		if (isTeacher === true) {
			let ref = this.teachers.doc(ID);
			this.batch.set(ref, accountObject);
			await this.batch.commit();
			this.logEvent('TEACHER_SIGN_UP');
			return ID;
		} else {
			let ref = this.students.doc(ID);
			this.batch.set(ref, accountObject);
			await this.batch.commit();
			this.logEvent('STUDENT_SIGN_UP');
			return ID;
		}
	}

	//This function will take in a user's email & password and then log them in using Firebase
	//Authentication. It will then return the account user object that can be used to retrieve info like the
	//student/teacher object, etc. If the info is incorrect, the value -1 will be returned
	static async logIn(email, password) {
		try {
			let account = await this.auth.signInWithEmailAndPassword(email, password);
			//Subscribes to the notification topic associated with this user
			this.fcm.subscribeToTopic(account.user.uid);
			return account.user;
		} catch (err) {
			return -1;
		}
	}

	//This function takes in a user's email and sends them a code to reset their password
	static async sendForgotPasswordCode(email) {
		this.logEvent('SEND_FORGOT_PASSWORD_EMAIL');
		await firebase.auth().sendPasswordResetEmail(email);

		return 0;
	}

	//This functions will log out whatever user is currently signed into the device
	static async logOut(userID) {
		//Unsubscribes the user from the topic so they no longer recieve notification
		this.fcm.unsubscribeFromTopic(userID);
		this.logEvent('LOG_OUT');
		await this.auth.signOut();
	}

	//This function will take in an ID of a teacher and return that teacher object.
	//Will return -1 if the document does not exist
	static async getTeacherByID(ID) {
		let teacher = await this.teachers.doc(ID).get();
		if (teacher.exists) {
			return teacher.data();
		} else {
			return -1;
		}
	}

	//This function will take in an ID of a student and return that student's object
	//Will return -1 if the document does not exist
	static async getStudentByID(ID) {
		let student = await this.students.doc(ID).get();
		if (student.exists) {
			return student.data();
		} else {
			return -1;
		}
	}

	//This function will take in an ID of a class and return that class object
	//Will return -1 if the document does not exist
	static async getClassByID(ID) {
		let classByID = await this.classes.doc(ID).get();
		if (classByID.exists) {
			return classByID.data();
		} else {
			return -1;
		}
	}

	//This function will take in an array of class IDs and return an array of class objects that'll
	//be fetched from firestore
	static async getClassesByIDs(classIDs) {
		let arrayOfClassObjects = [];
		for (let i = 0; i < classIDs.length; i++) {
			const classObject = await this.getClassByID(classIDs[i]);
			arrayOfClassObjects.push(classObject);
		}
		return arrayOfClassObjects;
	}

	//This function will take in an ID of a teacher document, and an updated object, and will update
	//the document in firestore accordingly
	static async updateTeacherObject(ID, newObject) {
		let docRef = this.teachers.doc(ID);
		await docRef.update(newObject);
		return 0;
	}

	//This function will take in an ID of a class document, and an updated object, and will update the
	//document in firestore accordingly
	static async updateClassObject(ID, newObject) {
		let docRef = this.classes.doc(ID);
		await docRef.update(newObject);
		return 0;
	}

	//This function will take in an ID of a student document, and an updated object, and will update the
	//document in firestore accordingly
	static async updateStudentObject(ID, newObject) {
		let docRef = this.students.doc(ID);
		await docRef.update(newObject);
		return 0;
	}

	//This function will update the student info in both the students collection and the class object of
	//the student inside the classes collection. This method will take in the ID of the student, as well
	//as the information to update
	static async updateStudentProfileInfo(userID, classes, name, phoneNumber, profileImageID) {
		await this.updateStudentObject(userID, {
			name,
			phoneNumber,
			profileImageID
		});

		//Rewrites all of the versions of this student in all of the classes they are a part of with their
		//new name and profile picture
		classes.forEach(async (eachClass) => {
			let currentClass = await this.getClassByID(eachClass.ID);
			let arrayOfStudents = currentClass.students;
			let studentIndex = arrayOfStudents.findIndex((student) => {
				return student.ID === userID;
			});
			arrayOfStudents[studentIndex].name = name;
			arrayOfStudents[studentIndex].profileImageID = profileImageID;
			await this.updateClassObject(eachClass.ID, {
				students: arrayOfStudents
			});
		});

		return 0;
	}

	//This function will take in a new class object, and a teacher object and create a new class
	//that belongs to that teacher in the firestore database. It will do this by creating a new document
	//in the "classes" collection, then linking that class to a certain teacher by relating them through
	//IDs. This method returns the new ID of the class
	static async addNewClass(newClassObject, teacherID) {
		//Adds the new class document and makes sure it has a reference to its own ID
		let newClass = await this.classes.add(newClassObject);
		const ID = (currentClassID = newClass.id + '');
		await this.updateClassObject(newClass.id, {
			ID
		});
		//Appends the class ID to the array of classes belonging to this teacher
		let ref = this.teachers.doc(teacherID);
		await ref.update({
			currentClassID,
			classes: firebase.firestore.FieldValue.arrayUnion(ID)
		});
		this.logEvent('ADD_NEW_CLASS');
		return ID;
	}

	//This method will disasociate a class from a specific teacher. It will take in the class ID & the teacher ID and disconnect the
	//two. The class object will be still stored in the firestore.
	static async deleteClass(classID, teacherID) {
		const thisClass = await this.getClassByID(classID);
		const arrayOfTeachers = thisClass.teachers;
		const indexOfTeacher = arrayOfTeachers.findIndex((element) => {
			return element === teacherID;
		});
		arrayOfTeachers.splice(indexOfTeacher, 1);
		await this.updateClassObject(classID, {
			teachers: arrayOfTeachers
		});

		const thisTeacher = await this.getTeacherByID(teacherID);
		const arrayOfClasses = thisTeacher.classes;
		const indexOfClass = arrayOfClasses.findIndex((element) => {
			return element === classID;
		});
		arrayOfClasses.splice(indexOfClass, 1);
		if (arrayOfClasses.length === 0) {
			await this.updateTeacherObject(teacherID, {
				classes: arrayOfClasses,
				currentClassID: ''
			});
		} else {
			await this.updateTeacherObject(teacherID, {
				classes: arrayOfClasses,
				currentClassID: arrayOfClasses[0]
			});
		}

		return 0;
	}

	//This function will update the assignment status of a particular student within a class. It will
	//simply reverse whatever the property is at the moment (true --> false & vice verca). This property
	//is located within a student object that is within a class object
	static async updateStudentAssignmentStatus(classID, studentID, status, index) {
		let currentClass = await this.getClassByID(classID);

		let arrayOfStudents = currentClass.students;
		let studentIndex = arrayOfStudents.findIndex((student) => {
			return student.ID === studentID;
		});

		arrayOfStudents[studentIndex].currentAssignments[index].isReadyEnum = status;

		await this.updateClassObject(classID, {
			students: arrayOfStudents
		});
		this.logEvent('UPDATE_ASSIGNMENT_STATUS');

		//Sends a notification to each of the teachers that are teacher this class,
		//letting them know of the updated assignment status
		const message =
			status === 'WORKING_ON_IT'
				? strings.WorkingOnIt
				: status === 'NEED_HELP'
				? strings.NeedsHelp
				: strings.Ready;
		currentClass.teachers.forEach(async (teacherID) => {
			this.functions.httpsCallable('sendNotification')({
				topic: teacherID,
				title: strings.StudentUpdate,
				body: arrayOfStudents[studentIndex].name + strings.HasChangedAssignmentStatusTo + message
			});
		});

		return 0;
	}

	//This method will take in an audio file and a studentID, and will upload the audio file to that path
	static async uploadAudio(file, studentID) {
		await this.storage.ref('audioFiles/' + studentID).putFile(file);
		return 0;
	}

	//This method will take in a student ID and return the audio file associated with that studentID. If an audio
	//file doesn't exist, then the method will return -1.
	static async downloadAudioFile(audioFileID) {
		try {
			const file = this.storage.ref('audioFiles/' + audioFileID);
			const download = await file.getDownloadURL();
			return download;
		} catch (error) {
			this.logEvent('DOWNLOAD_AUDIO_FAILED', { audioFileID, error });
			return -1;
		}
	}

	static async updateClassAssignment(
		classID,
		newAssignmentName,
		assignmentType,
		assignmentLocation
	) {
		let currentClass = await this.getClassByID(classID);
		let arrayOfStudents = currentClass.students;
		arrayOfStudents.forEach((student) => {
			student.currentAssignment = newAssignmentName;
			student.currentAssignmentType = assignmentType;
			student.currentAssignmentLocation = assignmentLocation;

			try {
				//Notifies that student that their assignment has been updated
				this.functions.httpsCallable('sendNotification')({
					topic: student.ID,
					title: strings.AssignmentUpdate,
					body: strings.YourTeacherHasUpdatedYourCurrentAssignment
				});
			} catch (error) {
				//todo: log event when this happens
				this.logEvent('FAILED_TO_SEND_NOTIFICATIONS. Error: ' + error.toString());
			}
		});

		await this.updateClassObject(classID, {
			students: arrayOfStudents,
			currentAssignment: newAssignmentName,
			currentAssignmentType: assignmentType,
			currentAssignmentLocation: assignmentLocation
		});
		return 0;
	}

	//This function will complete a current assignment that belongs to a certain student within a class
	//It will take params of a studentID, a classID, and an evaluation object that it will add
	//to the array of the student's assignment history. Also increments the total assignment
	//count by 1. Then it calculates the new average grade for the student.
	static async completeCurrentAssignment(classID, studentID, evaluationDetails) {
		let currentClass = await this.getClassByID(classID);

		let arrayOfStudents = currentClass.students;
		let studentIndex = arrayOfStudents.findIndex((student) => {
			return student.ID === studentID;
		});

		arrayOfStudents[studentIndex].totalAssignments =
			arrayOfStudents[studentIndex].totalAssignments + 1;
		arrayOfStudents[studentIndex].assignmentHistory.push(evaluationDetails);

		let avgGrade = 0;
		arrayOfStudents[studentIndex].assignmentHistory.forEach((assignment) => {
			avgGrade += assignment.evaluation.rating;
		});
		avgGrade /= arrayOfStudents[studentIndex].totalAssignments;
		arrayOfStudents[studentIndex].averageRating = avgGrade;

		let indexOfAssignment = arrayOfStudents[studentIndex].currentAssignments.findIndex((element) => {
			return element.name === evaluationDetails.name && element.type === evaluationDetails.type;
		});

		arrayOfStudents[studentIndex].currentAssignments.splice(indexOfAssignment, 1);

		await this.updateClassObject(classID, {
			students: arrayOfStudents
		});
		this.analytics.logEvent('COMPLETE_CURRENT_ASSIGNMENT', {
			improvementAreas: evaluationDetails.improvementAreas
		});

		//Notifies that student that their assignment has been graded
		this.functions.httpsCallable('sendNotification')({
			topic: studentID,
			title: strings.AssignmentGraded,
			body: strings.YourAssignmentHasBeenGraded
		});
		return 0;
	}

	//This function will take in an assignment details object and overwrite an old evaluation with the new data.
	//It will take in a classID, a studentID, and an evaluationID in order to locate the correct evaluation object
	static async overwriteOldEvaluation(classID, studentID, evaluationID, newEvaluation) {
		let currentClass = await this.getClassByID(classID);
		let arrayOfStudents = currentClass.students;
		let studentIndex = arrayOfStudents.findIndex((student) => {
			return student.ID === studentID;
		});

		let copyOfEvaluationObjectIndex = arrayOfStudents[studentIndex].assignmentHistory.findIndex(
			(assignment) => {
				return assignment.ID === evaluationID;
			}
		);

		arrayOfStudents[studentIndex].assignmentHistory[
			copyOfEvaluationObjectIndex
		].evaluation = newEvaluation;

		await this.updateClassObject(classID, {
			students: arrayOfStudents
		});
		this.analytics.logEvent('OVERWRITE_PAST_EVALUATION', {
			improvementAreas: newEvaluation.improvementAreas
		});

		return 0;
	}

	//This method will take in a classID & a specific date as well as an array of absent students
	//It will then save the attendance for each student that day. The attendace will be saved in the class version
	//of the student object because attendance is per class
	static async saveAttendanceForClass(absentStudents, selectedDate, classID) {
		let currentClass = await this.getClassByID(classID);
		let arrayOfStudents = currentClass.students;
		arrayOfStudents.forEach((student, index) => {
			//If the attendance already exists, then the code will automatically replace
			//the old attendance with this one
			let copyOfStudent = student;
			let { attendanceHistory } = copyOfStudent;
			attendanceHistory[selectedDate] = absentStudents.includes(student.ID) ? false : true;
			copyOfStudent.attendanceHistory = attendanceHistory;
			arrayOfStudents[index] = copyOfStudent;
			if (absentStudents.includes(student.ID)){
				copyOfStudent.classesMissed? copyOfStudent.classesMissed += 1: copyOfStudent.classesMissed = 1; 
			}
			else {
				copyOfStudent.classesAttended? copyOfStudent.classesAttended += 1: copyOfStudent.classesAttended = 1; 

			}
		});

		await this.updateClassObject(classID, {
			students: arrayOfStudents
		});
		this.logEvent('SAVE_ATTENDANCE');

		return 0;
	}

	//This function takes in a date as a parameter and returns an array of students that were absent for this specifc
	//date. If a particular student does not have an attendance saved for this date, then they will not be added to the
	//array of absent students. To locate the particular class to return the attendance to, the classID will also be
	//a paremeter
	static async getAbsentStudentsByDate(date, classID) {
		let absentStudents = [];
		let currentClass = await this.getClassByID(classID);

		currentClass.students.forEach((student) => {
			let studentAttendanceHistory = student.attendanceHistory;
			if (studentAttendanceHistory[date] === false) {
				absentStudents.push(student.ID);
			}
		});
		this.logEvent('GET_ATTENDANCE_BY_DATE');

		return absentStudents;
	}

	//This method will allow a student to join a class. It will take in a student object and a classID.
	//It will add that student to the array of students within the class object. Then it will add
	//the classID to the array of classes withint the student object. Then it will finally update
	//the "currentClassID" property within the student object. If the class does not exist, the method
	//will return a value of -1, otherwise it will return 0;
	static async joinClass(student, classID) {
		const studentID = student.ID;

		const classToJoin = await this.classes.doc(classID).get();
		if (!classToJoin.exists) {
			return -1;
		}

		const studentObject = {
			ID: studentID,
			assignmentHistory: [],
			attendanceHistory: {},
			averageRating: 0,
			currentAssignments: [],
			isReadyEnum: 'WORKING_ON_IT',
			profileImageID: student.profileImageID,
			name: student.name,
			totalAssignments: 0,
			classesAttended: 0,
			classesMissed: 0
		};

		await this.updateClassObject(classID, {
			students: firebase.firestore.FieldValue.arrayUnion(studentObject)
		});

		await this.updateStudentObject(studentID, {
			classes: firebase.firestore.FieldValue.arrayUnion(classID),
			currentClassID: classID
		});
		this.logEvent('JOIN_CLASS');

		//Sends a notification to the teachers of that class saying that a student has joined the class
		classToJoin.data().teachers.forEach((teacherID) => {
			this.functions.httpsCallable('sendNotification')({
				topic: teacherID,
				title: strings.NewStudent,
				body: student.name + strings.HasJoinedYourClass
			});
		});
		return studentObject;
	}

	//This function will be responsible for adding a student manually from a teacher's side. It will
	//create a student object in the database & link it to the class like it would a normal student.
	//The only difference here is that an account will not be created/associated with this student
	//object. Additionally, it will have a property called "isManual" that indicates that this is a manual
	//object, and not an actual student account. The function will take in a student name & a profile pic
	//& a class ID and will return the newly created student object. (the class version)
	static async addManualStudent(name, profileImageID, classID) {
		const studentObject = {
			classes: [classID],
			currentClassID: classID,
			emailAddress: '',
			name,
			phoneNumber: '',
			profileImageID,
			isManual: true,
			classesMissed: 0,
			classesAttended: 0
		};
		const studentAdded = await this.students.add(studentObject);
		const studentID = studentAdded.id;
		await this.updateStudentObject(studentID, {
			ID: studentID
		});
		const student = await this.getStudentByID(studentID);

		const classToJoin = await this.classes.doc(classID).get();
		if (!classToJoin.exists) {
			return -1;
		}

		const studentClassObject = {
			ID: studentID,
			assignmentHistory: [],
			attendanceHistory: {},
			averageRating: 0,
			currentAssignment: 'None',
			isReadyEnum: 'WORKING_ON_IT',
			profileImageID: student.profileImageID,
			name: student.name,
			isManual: true,
			totalAssignments: 0
		};

		await this.updateClassObject(classID, {
			students: firebase.firestore.FieldValue.arrayUnion(studentClassObject)
		});

		this.logEvent('MANUAL_STUDENT_ADDITION');

		return studentClassObject;
	}

	//This function will take in a student ID & a class ID and remove the connection between that student
	//and the class
	static async removeStudent(classID, studentID) {
		//First removes the student from the class
		let theClass = await this.getClassByID(classID);
		let arrayOfClassStudents = theClass.students;
		let indexOfStudent = arrayOfClassStudents.findIndex((student) => {
			return student.ID === studentID;
		});
		arrayOfClassStudents.splice(indexOfStudent, 1);
		await this.updateClassObject(classID, {
			students: arrayOfClassStudents
		});

		//Then removes the class's reference from the student's array of classes.
		//If it's a manual student, it deletes the whole object
		let theStudent = await this.getStudentByID(studentID);
		if (theStudent.isManual && theStudent.isManual === true) {
			await this.students.doc(studentID).delete();
		} else {
			let arrayOfStudentClasses = theStudent.classes;
			let indexOfClass = arrayOfStudentClasses.findIndex((eachClass) => {
				return eachClass === classID;
			});
			arrayOfClassStudents.splice(indexOfClass, 1);
			if (arrayOfClassStudents.length > 0) {
				await this.updateStudentObject(studentID, {
					classes: arrayOfClassStudents,
					currentClassID: arrayOfClassStudents[0]
				});
			} else {
				await this.updateStudentObject(studentID, {
					classes: arrayOfClassStudents,
					currentClassID: ''
				});
			}
			this.logEvent('TEACHER_REMOVE_STUDENT');
		}

		return 0;
	}

	//This function will take a name of an event and log it to firebase analytics (not async)
	static logEvent(eventName, eventArgs) {
		if (eventArgs !== undefined) {
			this.analytics.logEvent(eventName, eventArgs);
		} else {
			this.analytics.logEvent(eventName);
		}
	}

	//This function will take in the name of a screen as well as the name of the class and set the
	//current screen to those inputs in firebase analytics (not async)
	static setCurrentScreen(screenName, screenClass) {
		this.analytics.setCurrentScreen(screenName, screenClass);
	}
}
