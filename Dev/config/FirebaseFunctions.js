//This class will contain all the functions that interact with the react native firebase
//library
import firebase from 'react-native-firebase';

export default class FirebaseFunctions {

    //References that'll be used throughout the class's static functions
    static database = firebase.firestore();
    static batch = this.database.batch();
    static teachers = this.database.collection('teachers');
    static students = this.database.collection('students');
    static classes = this.database.collection('classes');
    static auth = firebase.auth();
    static analytics = firebase.analytics();

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
        accountObject.ID = ID;
        if (isTeacher === true) {

            let ref = this.teachers.doc(ID);
            this.batch.set(ref, accountObject);
            await this.batch.commit();
            this.logEvent("TEACHER_SIGN_UP");
            return ID;

        } else {

            let ref = this.students.doc(ID);
            this.batch.set(ref, accountObject);
            await this.batch.commit();
            this.logEvent("STUDENT_SIGN_UP");
            return ID;

        }

    }

    //This function will take in a user's email & password and then log them in using Firebase 
    //Authentication. It will then return the account user object that can be used to retrieve info like the
    //student/teacher object, etc. If the info is incorrect, the value -1 will be returned
    static async logIn(email, password) {

        try {
            let account = await this.auth.signInWithEmailAndPassword(email, password);
            return account.user;
        } catch (err) {
            return -1;
        }

    }

    //This function takes in a user's email and sends them a code to reset their password
    static async sendForgotPasswordCode(email) {

        this.logEvent("SEND_FORGOT_PASSWORD_EMAIL");
        await this.auth.sendPasswordResetEmail(email);

    }

    //This functions will log out whatever user is currently signed into the device
    static async logOut() {

        this.logEvent("LOG_OUT");
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

    //This function will take in a new class object, and a teacher object and create a new class
    //that belongs to that teacher in the firestore database. It will do this by creating a new document
    //in the "classes" collection, then linking that class to a certain teacher by relating them through
    //IDs. This method returns the new ID of the class
    static async addNewClass(newClassObject, teacherID) {

        //Adds the new class document and makes sure it has a reference to its own ID
        let newClass = await this.classes.add(newClassObject);
        const ID = currentClassID = newClass.id + "";
        await this.updateClassObject(newClass.id, {
            ID
        });
        //Appends the class ID to the array of classes belonging to this teacher
        let ref = this.teachers.doc(teacherID);
        await ref.update({
            currentClassID,
            classes: firebase.firestore.FieldValue.arrayUnion(ID)
        });
        this.logEvent("ADD_NEW_CLASS");
        return ID;

    }

    //This method will disasociate a class from a specific teacher. It will take in the class ID & the teacher ID and disconnect the
    //two. The class object will be still stored in the firestore.
    static async deleteClass(classID, teacherID) {

        const thisClass = await this.getClassByID(classID);
        const arrayOfTeachers = thisClass.teachers;
        const indexOfTeacher = arrayOfTeachers.findIndex((element) => {
            return element === teacherID
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
    static async updateStudentAssignmentStatus(classID, studentID) {

        let currentClass = await this.getClassByID(classID);

        let arrayOfStudents = currentClass.students;
        let studentIndex = arrayOfStudents.findIndex((student) => {
            return student.ID === studentID;
        });

        arrayOfStudents[studentIndex].isReady = !(arrayOfStudents[studentIndex].isReady);

        await this.updateClassObject(classID, {
            students: arrayOfStudents
        });
        this.logEvent("UPDATE_ASSIGNMENT_STATUS");
        return 0;

    }

    //This method will update the currentAssignment property of a student within a class.
    //To locate the correct student, the method will take in params of the classID, the studentID,
    //and finally, the name of the new assignment which it will set the currentAssignment property 
    //to
    static async updateStudentCurrentAssignment(classID, studentID, newAssignmentName) {

        let currentClass = await this.getClassByID(classID);

        let arrayOfStudents = currentClass.students;
        let studentIndex = arrayOfStudents.findIndex((student) => {
            return student.ID === studentID;
        });
        arrayOfStudents[studentIndex].currentAssignment = newAssignmentName;

        await this.updateClassObject(classID, {
            students: arrayOfStudents
        });
        this.logEvent("UPDATE_CURRENT_ASSIGNMENT");
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

        arrayOfStudents[studentIndex].totalAssignments = arrayOfStudents[studentIndex].totalAssignments + 1;
        arrayOfStudents[studentIndex].assignmentHistory.push(evaluationDetails);

        let avgGrade = 0;
        arrayOfStudents[studentIndex].assignmentHistory.forEach((assignment) => {
            avgGrade += assignment.evaluation.rating;
        });
        avgGrade /= arrayOfStudents[studentIndex].totalAssignments;
        arrayOfStudents[studentIndex].averageRating = avgGrade;

        await this.updateClassObject(classID, {
            students: arrayOfStudents
        });
        this.logEvent("COMPLETE_CURRENT_ASSIGNMENT");

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

        let copyOfEvaluationObjectIndex = arrayOfStudents[studentIndex].assignmentHistory.findIndex((assignment) => {
            return assignment.ID === evaluationID;
        });

        arrayOfStudents[studentIndex].assignmentHistory[copyOfEvaluationObjectIndex].evaluation = newEvaluation;

        await this.updateClassObject(classID, {
            students: arrayOfStudents
        });
        this.logEvent("OVERWRITE_PAST_EVALUATION");

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
            attendanceHistory[selectedDate] = (absentStudents.includes(student.ID) ? false : true);
            copyOfStudent.attendanceHistory = attendanceHistory;
            arrayOfStudents[index] = copyOfStudent;
        });

        await this.updateClassObject(classID, {
            students: arrayOfStudents
        });
        this.logEvent("SAVE_ATTENDANCE");

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
        this.logEvent("GET_ATTENDANCE_BY_DATE");

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
            currentAssignment: 'None',
            isReady: true,
            profileImageID: student.profileImageID,
            name: student.name,
            totalAssignments: 0
        }

        await this.updateClassObject(classID, {
            students: firebase.firestore.FieldValue.arrayUnion(studentObject)
        });

        await this.updateStudentObject(studentID, {
            classes: firebase.firestore.FieldValue.arrayUnion(classID),
            currentClassID: classID
        });
        this.logEvent("JOIN_CLASS");

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
            emailAddress: "",
            name,
            phoneNumber: '',
            profileImageID,
            isManual: true
        }
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
            isReady: true,
            profileImageID: student.profileImageID,
            name: student.name,
            totalAssignments: 0
        }

        await this.updateClassObject(classID, {
            students: firebase.firestore.FieldValue.arrayUnion(studentClassObject)
        });

        this.logEvent("MANUAL_STUDENT_ADDITION");

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
            await this.updateStudentObject(studentID, {
                classes: arrayOfClassStudents
            });
            this.logEvent("TEACHER_REMOVE_STUDENT");
        }

        return 0;

    }

    //This function will take a name of an event and log it to firebase analytics (not async)
    static logEvent(eventName) {

        this.analytics.logEvent(eventName);

    }

    //This function will take in the name of a screen as well as the name of the class and set the
    //current screen to those inputs in firebase analytics (not async)
    static setCurrentScreen(screenName, screenClass) {

        this.analytics.setCurrentScreen(screenName, screenClass);

    }

}