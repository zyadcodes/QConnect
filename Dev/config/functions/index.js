//This file contains all of the Cloud Functions that will be used by Quran Connect to interact with Cloud Firestore
//and other Firebase functionality
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./qcServiceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://quranconnect-4e4bc.firebaseio.com',
});

const messaging = admin.messaging();
const firestore = admin.firestore();
const Teachers = firestore.collection('Teachers');
const Classes = firestore.collection('Classes');
const Students = firestore.collection('Students');
const batch = firestore.batch();

// -------------------------- Document Creators, Getters, and Updaters --------------------------

//Method takes in all the required information to create a teacher document, and adds it to Cloud Firestore under
//the Teachers collection.
exports.createTeacher = functions.https.onCall(async (input, context) => {
	const { emailAddress, name, phoneNumber, profileImageID, teacherID } = input;

	batch.create(Teachers.doc(teacherID), {
		classIDs: [],
		currentClassID: '',
		emailAddress,
		name,
		phoneNumber,
		profileImageID,
		teacherID,
	});
	await batch.commit();
	return 0;
});

//Method takes in all the required information to create a student document, and adds it to Cloud Firestore under
//the Students collection.
exports.createStudent = functions.https.onCall(async (input, context) => {
	const { emailAddress, isManual, name, phoneNumber, profileImageID, studentID } = input;

	batch.create(Students.doc(studentID), {
		classIDs: [],
		currentClassID: '',
		emailAddress,
		isManual,
		name,
		phoneNumber,
		profileImageID,
		studentID,
	});
	await batch.commit();
	return 0;
});

//Method takes in all the required information to create a class document, and adds it to Cloud Firestore under
//the Classes collection.
exports.createClass = functions.https.onCall(async (input, context) => {
	const { classImageID, className, teacherID } = input;

	const newClassDocument = await Classes.add({ classImageID, className, students: [] });
	//Adds the base class invite code, the classID and the teacher's information to the newly created class document
	const result = await firestore.runTransaction(async (transaction) => {
		const teacherDocument = (await transaction.get(Teachers.doc(teacherID))).data();

		await transaction.update(Classes.doc(newClassDocument.id), {
			classID: newClassDocument.id,
			classInviteCode: newClassDocument.id.substring(0, 5),
			teachers: [
				{
					name: teacherDocument.name,
					profileImageID: teacherDocument.profileImageID,
					teacherID,
				},
			],
		});

		return 0;
	});

	return result;
});

//Method takes in a teacher ID and returns that document's data as an object. If the teacher document doesn't exist,
//method returns -1;
exports.getTeacherByID = functions.https.onCall(async (input, context) => {
	const { teacherID } = input;

	const result = await firestore.runTransaction(async (transaction) => {
		const document = await transaction.get(Teachers.doc(teacherID));
		if (document.exists) {
			return document.data();
		} else {
			return -1;
		}
	});

	return result;
});

//Method takes in a student ID and returns that document's data as an object. If the student document doesn't exist,
//method returns -1;
exports.getStudentByID = functions.https.onCall(async (input, context) => {
	const { studentID } = input;

	const result = await firestore.runTransaction(async (transaction) => {
		const document = await transaction.get(Students.doc(studentID));
		if (document.exists) {
			return document.data();
		} else {
			return -1;
		}
	});
	return result;
});

//Method takes in a class ID and returns that document's data as an object. If the class document doesn't exist,
//method returns -1;
exports.getClassByID = functions.https.onCall(async (input, context) => {
	const { classID } = input;

	const result = await firestore.runTransaction(async (transaction) => {
		const document = await transaction.get(Classes.doc(classID));
		if (document.exists) {
			return document.data();
		} else {
			return -1;
		}
	});

	return result;
});

//This method is going to take an object containing updates and a teacherID. Then it will update the teacher document
//in Cloud Firestore. If, based on the updates, the Teacher Object also needs to updated in other locations where data
//needs to be consistant, then that will also happen.
exports.updateTeacherByID = functions.https.onCall(async (input, context) => {
	const { teacherID, updates } = input;

	//Checks if the updates contain data that needs to be consistent across both the teacher document and the
	//teacher in the array of teachers in the classes collection
	if (updates.name || updates.profileImageID) {
		await firestore.runTransaction(async (transaction) => {
			const teacherDocument = (await transaction.get(Teachers.doc(teacherID))).data();
			const classDocuments = await teacherDocument.classIDs.map(async (classID) =>
				(await transaction.get(Classes.doc(classID))).data()
			);
			for (const eachClass of classDocuments) {
				const updatedClass = eachClass;
				const indexOfTeacher = eachClass.teachers.findIndex(
					(eachTeacher) => eachTeacher.teacherID === teacherID
				);
				if (updates.name) {
					updatedClass.teachers[indexOfTeacher].name = updates.name;
				}
				if (updates.profileImageID) {
					updatedClass.teachers[indexOfTeacher].profileImageID = updates.profileImageID;
				}
				await transaction.update(Classes.doc(eachClass.classID), {
					teachers: updatedClass.teachers,
				});
			}
			await transaction.update(Teachers.doc(teacherID), updates);
		});
	} else {
		batch.update(Teachers.doc(teacherID), updates);
		await batch.commit();
	}

	return 0;
});

//This method is going to take an object containing updates and a studentID. Then it will update the student document
//in Cloud Firestore. If, based on the updates, the Student Object also needs to updated in other locations where data
//needs to be consistant, then that will also happen.
exports.updateStudentByID = functions.https.onCall(async (input, context) => {
	const { studentID, updates } = input;

	//Checks if the updates contain data that needs to be consistent across both the student document and the
	//student in the array of students in the classes collection
	if (updates.name || updates.profileImageID) {
		await firestore.runTransaction(async (transaction) => {
			const studentDocument = (await transaction.get(Students.doc(studentID))).data();
			const classDocuments = await studentDocument.classIDs.map(async (classID) =>
				(await transaction.get(Classes.doc(classID))).data()
			);
			for (const eachClass of classDocuments) {
				const updatedClass = eachClass;
				const indexOfStudent = eachClass.students.findIndex(
					(eachStudent) => eachStudent.studentID === studentID
				);
				if (updates.name) {
					updatedClass.students[indexOfStudent].name = updates.name;
				}
				if (updates.profileImageID) {
					updatedClass.students[indexOfStudent].profileImageID = updates.profileImageID;
				}
				await transaction.update(Classes.doc(eachClass.classID), {
					students: updatedClass.students,
				});
				await transaction.update(
					Classes.doc(eachClass.classID)
						.collection('Students')
						.doc(studentID),
					{
						name: updates.name,
						profileImageID: updates.profileImageID,
					}
				);
			}
			await transaction.update(Students.doc(studentID), updates);
		});
	} else {
		batch.update(Students.doc(studentID), updates);
		await batch.commit();
	}

	return 0;
});

//This method is going to take an object containing updates and a classID. Then it will update the class document
//in Cloud Firestore.
exports.updateClassByID = functions.https.onCall(async (input, context) => {
	const { classID, updates } = input;

	batch.update(Classes.doc(classID), updates);
	await batch.commit();
	return 0;
});

// -------------------------- Join Class Functions --------------------------

//This method is going to take in a studentID and a classInviteCode as parameters. It is then going to connect
//the two documents by adding the classID to the array of the student's classes. Then it will add the student snippet
//object to the class document. Then it creates the student document in the Students subcollection under the class document
//and fills in the proper information. If it is an incorrect classInviteCode, the method will return -1;
exports.joinClassByClassInviteCode = functions.https.onCall(async (input, context) => {
	const { studentID, classInviteCode } = input;

	const result = await firestore.runTransaction(async (transaction) => {
		const query = await transaction.get(Classes.where('classInviteCode', '==', classInviteCode));
		if (query.docs.length === 0) {
			return -1;
		}
		const classDocument = query.docs[0].data();
		const studentDocument = (await transaction.get(Students.doc(studentID))).data();

		await transaction.update(Students.doc(studentID), {
			classes: admin.firestore.FieldValue.arrayUnion(classDocument.classID),
		});
		await transaction.update(Classes.doc(classDocument.classID), {
			students: admin.firestore.FieldValue.arrayUnion({
				name: studentDocument.name,
				studentID,
				profileImageID: studentDocument.profileImageID,
			}),
		});
		await transaction.set(
			Classes.doc(classDocument.classID)
				.collection('Students')
				.doc(studentID),
			{
				averageRating: 0,
				classesMissed: 0,
				classesAttended: 0,
				name: studentDocument.name,
				profileImageID: studentDocument.profileImageID,
				studentID,
				totalAssignments: 0,
			}
		);
		return 0;
	});

	return result;
});

// -------------------------- Assignment Functions --------------------------

//This method is going to take in assignment details and a studentID and a classID as parameters, and is going to add
//that assignment as a document to the student's assingments subcollection. The method is going to return
//the newly created assignment document's ID
exports.addAssignmentByStudentID = functions.https.onCall(async (input, context) => {
	const { classID, studentID, location, name, type } = input;

	const date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	const assignmentDate = year + '-' + month + '-' + day;

	const newDocument = await Classes.doc(classID)
		.collection('Students')
		.doc(studentID)
		.collection('Assignments')
		.add({
			assignmentDate,
			location,
			name,
			type,
			status: 'NOT_STARTED',
		});

	await Classes.doc(classID)
		.collection('Students')
		.doc(studentID)
		.collection('Assignments')
		.doc(newDocument.id)
		.update({
			assignmentID: newDocument.id,
		});

	sendNotification(studentID, 'New Assignment', 'Your teacher has added a new assignment for you.');
	return newDocument.id;
});

// -------------------------- Attendance Functions --------------------------

//This method is going to take in a classID and a day string in the format YYYY-MM-DD and an object containing key-value pairs of
//students and their attendance for that specific day. If there is already an attendance that exists and is saved to that
//day, then the method will override that document with the new updated attendance for that day. If there isn't an
//exisitng attendance for the day, then a new document will be added for that day containing the attendance.
exports.saveAttendanceForClassByDay = functions.https.onCall(async (input, context) => {
	const { classID, day, attendanceObject } = input;
	const result = await firestore.runTransaction(async (transaction) => {
		const attendanceDocument = Classes.doc(classID)
			.collection('Attendance')
			.doc(day);
		await transaction.set(attendanceDocument, attendanceObject);
		return 0;
	});

	return result;
});

//This method is going to take a classID and a day string in the format YYYY-MM-DD and is going to return an array
//an object that contains keys which are each studentID, and a boolean value for that student which indicates whether
//the student was there or not. true means they were present, while false means they were not. If there is no attendance data
//for that day, an empty object will be returned.
exports.getAttendanceForClassByDay = functions.https.onCall(async (input, context) => {
	const { classID, day } = input;

	const result = await firestore.runTransaction(async (transaction) => {
		const attendanceDocument = await transaction.get(
			Classes.doc(classID)
				.collection('Attendance')
				.doc(day)
		);
		if (attendanceDocument.exists) {
			return attendanceDocument.data();
		} else {
			return {};
		}
	});

	return result;
});

// -------------------------- Email & Notifications --------------------------

//Method sends a notification with a custom title and body to a specific topic (user)
exports.sendNotification = functions.https.onCall(async (input, context) => {
	const { topic, title, body } = input;
	await sendNotification(topic, title, body);
	return 0;
});

// -------------------------- Helper Functions --------------------------

//This method will serve as the global function for sending notifications to a specific topic (user)
const sendNotification = async (topic, title, body) => {
	await messaging.sendToTopic(topic, {
		notification: {
			title,
			body,
		},
	});
};
