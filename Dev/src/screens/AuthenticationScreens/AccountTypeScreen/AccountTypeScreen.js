import React, { useEffect } from 'react';
import { View, ScrollView, ImageBackground } from 'react-native';
import QcActionButton from 'components/QcActionButton';
import QcAppBanner from 'components/QcAppBanner';
import strings from '../../../../config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/screenStyle';
import BG_IMAGE from 'assets/images/read_child_bg.jpg';
import styles from './AccountTypeScreenStyle';

// Creates the functional component
const AccountTypeScreen = (props) => {
	// The useEffect method, which acts as a componentDidMount, gets automatically called once the screen is mounted
	useEffect(() => {
		// Sets the screen analytics in Firebase
		FirebaseFunctions.setCurrentScreen('Account Type Screen', 'AccountTypeScreen');
	});

	// Renders the UI of the screen
	return (
		<View style={screenStyle.container}>
			<ScrollView>
				<ImageBackground source={BG_IMAGE} style={styles.bgImage}>
					<View style={styles.topSpacer} />
					<QcAppBanner />
					<View style={styles.topSpacer} />
					<View style={styles.middleSpacers}>
						<QcActionButton
							navigation={navigation}
							text={strings.IAmATeacher}
							onPress={() => {
								//Navigates to the teacher side
								props.navigation.push('TeacherWelcomeScreen');
							}}
						/>
						<View style={styles.middleSpacers} />
						<QcActionButton
							navigation={navigation}
							text={strings.IAmAStudent}
							onPress={() => {
								// Navigates to the student side
								props.navigation.push('StudentWelcomeScreen');
							}}
						/>
					</View>
					<View style={styles.middleSpacers} />
				</ImageBackground>
			</ScrollView>
		</View>
	);
};

// Exports the component
export default AccountTypeScreen;
