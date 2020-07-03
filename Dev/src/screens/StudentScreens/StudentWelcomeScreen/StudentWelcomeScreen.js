// This is going to be the screen where the student signs up and creates their profile
import React, { useState, useEffect } from 'react';
import {
	View,
	Image,
	TouchableOpacity,
	Alert,
	ScrollView,
	LayoutAnimation,
	Platform,
} from 'react-native';
import { getRandomGenderNeutralImage, getHighlightedImages } from './FunctionHelpers';
import QcActionButton from 'components/QcActionButton/QcActionButton';
import ImageSelectionRow from 'components/ImageSelectionRow/ImageSelectionRow';
import ImageSelectionModal from 'components/ImageSelectionModal/ImageSelectionModal';
import TeacherInfoEntries from 'components/TeacherInfoEntries/TeacherInfoEntries';
import studentImages from 'config/studentImages';
import strings from 'config/strings';
import FadeInView from '../../../components/FadeInView/FadeInView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { Icon } from 'react-native-elements';
import QCView from 'components/QCView/QCView';
import screenStyle from 'config/screenStyle';
import firebase from 'react-native-firebase';
import styles from './StudentWelcomeScreenStyle';

// Creates the functional component
const StudentWelcomeScreen = (props) => {
	// Declares the state fields for this class
	const [phoneNumber, setPhoneNumber] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [profileImageID, setProfileImageID] = useState(getRandomGenderNeutralImage());
	const [highlightedImagesIndices, setHighlightedImageIndices] = useState(getHighlightedImages());
	const [modalVisible, setModalVisible] = useState(false);
	const [isPhoneValid, setIsPhoneValid] = useState(false);

	// useEffect method replaces componentDidMount (gets called when component mounts)
	useEffect(() => {
		FirebaseFunctions.setCurrentScreen('Student Welcome Screen', 'StudentWelcomeScreen');
		if (Platform.OS === 'ios') {
			LayoutAnimation.easeInEaseOut();
		}
	}, []);

	// Helper function to set the state of the image selection row
	const onImageSelected = (index) => {
		let candidateImages = highlightedImagesIndices;

		if (highlightedImagesIndices.includes(index)) {
			candidateImages.splice(0, 1);
			candidateImages.splice(0, 0, index);
		}

		setProfileImageID(index);
		setHighlightedImageIndices(candidateImages);
		setModalVisible(false);
	};

	// Method signs the user up in Firebase Auth and then constructs the correct values in order to create a student object
	// in Cloud Firestore
	const saveProfileInfo = async () => {
		// Double checks all fields have been filled out correctly
		const trimmedName = name.trim();
		const trimmedPhoneNumber = phoneNumber.trim();
		const trimmedEmailAddress = emailAddress.trim();
		const trimmedPassword = password.trim();

		if (
			trimmedName === '' ||
			trimmedPhoneNumber === '' ||
			trimmedEmailAddress === '' ||
			trimmedPassword === ''
		) {
			Alert.alert(strings.Whoops, strings.PleaseMakeSureAllFieldsAreFilledOut);
		} else if (!isPhoneValid) {
			Alert.alert(strings.Whoops, strings.InvalidPhoneNumber);
		} else if (!trimmedEmailAddress.includes('@')) {
			Alert.alert(strings.Whoops, strings.BadEmail);
		} else if (trimmedPassword.length <= 6) {
			Alert.alert(strings.Whoops, strings.PasswordError);
		} else {
			const doesThisUserExist = await firebase
				.auth()
				.fetchSignInMethodsForEmail(trimmedEmailAddress);
			if (doesThisUserExist.length > 0) {
				Alert.alert(strings.Whoops, strings.EmailExists);
			} else {
				try {
					// Signs the user up in auth
					const ID = await FirebaseFunctions.signUp(trimmedEmailAddress, trimmedPassword);

					// Sends the correct information up to Firebase to add to the cloud Firestore
					await FirebaseFunctions.call('createStudent', {
						emailAddress: trimmedEmailAddress,
						isManual: false,
						name: trimmedName,
						phoneNumber: trimmedPhoneNumber,
						profileImageID,
						studentID: ID,
					});

					props.navigation.push('StudentCurrentClass', {
						userID: ID,
					});
				} catch (error) {
					if (err && err.message) {
						Alert.alert(strings.Whoops, err.message);
					} else {
						Alert.alert(strings.Whoops, strings.SomethingWentWrong);
					}
					FirebaseFunctions.logEvent('CREATE_USER_FAILED', { err });
				}
			}
		}
	};

	// Renders the UI for this screen
	return (
		<QCView style={screenStyle.container}>
			<ScrollView>
				<View>
					<ImageSelectionModal
						visible={modalVisible}
						images={studentImages.images}
						cancelText={strings.Cancel}
						setModalVisible={(value) => setModalVisible(value)}
						onImageSelected={(index) => onImageSelected(index)}
					/>
					<View style={styles.picContainer}>
						<View style={styles.filler} />
						<View style={styles.backButtonContainer}>
							<View style={styles.leftBackButtonSpacer} />
							<TouchableOpacity
								style={styles.backButtonTouchableOpacityContainer}
								onPress={() => {
									props.navigation.goBack();
								}}>
								<Icon name={'angle-left'} type='font-awesome' />
							</TouchableOpacity>
							<View style={styles.rightBackButtonSpacer} />
						</View>
						<View style={styles.welcomeImageContainer}>
							<FadeInView style={{ alignItems: 'center', justifyContent: 'center' }}>
								<Image style={styles.welcomeImage} source={require('assets/images/salam.png')} />
							</FadeInView>
						</View>
					</View>
					<View style={styles.editInfo} behavior='padding'>
						<TeacherInfoEntries
							name={name}
							phoneNumber={phoneNumber}
							emailAddress={emailAddress}
							password={password}
							onNameChanged={(name) => setName(name)}
							onPhoneNumberChanged={(text) => {
								setPhoneNumber(text.getValue());
								setIsPhoneValid(text.isValidNumber());
							}}
							onEmailAddressChanged={(text) => setEmailAddress(text)}
							showPasswordField={true}
							onPasswordChanged={(pw) => setPassword(pw)}
						/>
						<ImageSelectionRow
							images={studentImages.images}
							highlightedImagesIndices={highlightedImagesIndices}
							onImageSelected={(index) => onImageSelected(index)}
							onShowMore={() => setModalVisible(true)}
							selectedImageIndex={profileImageID}
						/>
					</View>
					<View style={styles.buttonsContainer}>
						<QcActionButton text={strings.CreateAccount} onPress={() => saveProfileInfo()} />
					</View>
					<View style={styles.filler} />
				</View>
			</ScrollView>
		</QCView>
	);
};

// Exports the component
export default StudentWelcomeScreen;
