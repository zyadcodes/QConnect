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
const Issues = firestore.collection('Issues');
const batch = firestore.batch();

// -------------------------- Document Creators, Getters, and Updaters --------------------------

//Method takes in all the required information to create a teacher document, and adds it to Cloud Firestore under
//the Teachers collection. The function will return 0 if successful, and -1 if unsucessful & will log it to the issues collection.
exports.createTeacher = functions.https.onCall(async (input, context) => {
	const { emailAddress, name, phoneNumber, profileImageID, teacherID } = input;

	try {
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
	} catch (error) {
		await Issues.add({
			error: { ...error },
			time: new Date().toLocaleString('en-US'),
			teacherID,
		});
		return -1;
	}
});

//Method takes in all the required information to create a student document, and adds it to Cloud Firestore under
//the Students collection. The function will return 0 if successful, and -1 if unsucessful & will log it to the issues collection.
exports.createStudent = functions.https.onCall(async (input, context) => {
	const { emailAddress, isManual, name, phoneNumber, profileImageID, studentID } = input;

	try {
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
	} catch (error) {
		await Issues.add({
			error: { ...error },
			time: new Date().toLocaleString('en-US'),
			studentID,
		});
		return -1;
	}
});

//Method takes in all the required information to create a class document, and adds it to Cloud Firestore under
//the Classes collection. The function will return 0 if successful, and -1 if unsucessful & will log it to the issues collection.
exports.createClass = functions.https.onCall(async (input, context) => {
	const { classImageID, className, teacherID } = input;

	let newClassDocument = '';

	try {
		newClassDocument = await Classes.add({ classImageID, className, students: [] });
	} catch (error) {
		await Issues.add({
			error: { ...error },
			time: new Date().toLocaleString('en-US'),
			teacherID,
		});
		return -1;
	}

	//Adds the base class invite code, the classID and the teacher's information to the newly created class document
	const result = await firestore.runTransaction(async (transaction) => {
		try {
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
		} catch (error) {
			await Issues.add({
				error: { ...error },
				time: new Date().toLocaleString('en-US'),
				teacherID,
			});
			return -1;
		}
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
//needs to be consistant, then that will also happen. If the method is successful, 0 will be returned, otherwise -1 will
//be returned and the issue will be logged in the Issues collection
exports.updateTeacherByID = functions.https.onCall(async (input, context) => {
	const { teacherID, updates } = input;

	try {
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
	} catch (error) {
		await Issues.add({
			error: { ...error },
			time: new Date().toLocaleString('en-US'),
			teacherID,
		});
		return -1;
	}
});

//This method is going to take an object containing updates and a studentID. Then it will update the student document
//in Cloud Firestore. If, based on the updates, the Student Object also needs to updated in other locations where data
//needs to be consistant, then that will also happen. If the method is successful, 0 will be returned, otherwise -1 will
//be returned and the issue will be logged in the Issues collection
exports.updateStudentByID = functions.https.onCall(async (input, context) => {
	const { studentID, updates } = input;

	try {
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
	} catch (error) {
		await Issues.add({
			error: { ...error },
			time: new Date().toLocaleString('en-US'),
			studentID,
		});
		return -1;
	}
});

//This method is going to take an object containing updates and a classID. Then it will update the class document
//in Cloud Firestore. If the method is successful, 0 will be returned, otherwise -1 will
//be returned and the issue will be logged in the Issues collection
exports.updateClassByID = functions.https.onCall(async (input, context) => {
	const { classID, updates } = input;
	try {
		batch.update(Classes.doc(classID), updates);
		await batch.commit();
		return 0;
	} catch (error) {
		await Issues.add({
			error: { ...error },
			time: new Date().toLocaleString('en-US'),
			classID,
		});
		return -1;
	}
});

// -------------------------- Email & Notifications --------------------------

//Method sends a notification with a custom title and body to a specific topic (user)
exports.sendNotification = functions.https.onCall(async (input, context) => {
	const { topic, title, body } = input;
	await messaging.sendToTopic(topic, {
		notification: {
			title,
			body,
		},
	});
	return 0;
});
