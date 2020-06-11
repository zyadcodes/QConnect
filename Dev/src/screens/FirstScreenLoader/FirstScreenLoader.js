<<<<<<< HEAD
import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, View, AppState } from 'react-native';
=======
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
>>>>>>> ef3710b129cc0b3bbdee990bd7364c9d9bfd3453
import FirebaseFunctions from 'config/FirebaseFunctions';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import OfflineEmptyState from 'components/OfflineEmptyState/OfflineEmptyState';
import FirstScreenLoaderStyle from './FirstScreenLoaderStyle';

// Declares the functional component
const FirstScreenLoader = (props) => {
	// Declares the state fields for this component
	const [alreadyCalled, setAlreadyCalled] = useState(false);
	const [showOfflineError, setShowOfflineError] = useState(false);

	// The useEffect method which serves as a componentDidMount method for functional components
	useEffect(() => {
		// useEffect can't take in an async function, so it calls a helper method to perform those tasks
		asynUseEffect();
	}, []);

<<<<<<< HEAD
  async tryInitUser() {
    let ret = true;
    await FirebaseFunctions.auth.onAuthStateChanged(async user => {
      try {
        if (this.state.alreadyCalled === false) {
          this.setState({ alreadyCalled: true });
          if (!user) {
            this.props.navigation.push("LoginScreen");
            return;
          }
          //Makes sure this user is subscribed to a topic
          FirebaseFunctions.fcm.subscribeToTopic(user.uid);
          const student = await FirebaseFunctions.getStudentByID(user.uid);
          if (student !== -1) {
            AppState.addEventListener("change", (newAppState) => {
              if(newAppState === 'background'){
                FirebaseFunctions.setUserActiveState(student.ID, false, 'away')
              }
            })
            FirebaseFunctions.setUserActiveState(student.ID, false, 'online');
            this.props.navigation.push("StudentCurrentClass", {
              userID: user.uid,
            });
            return;
          }
          AppState.addEventListener("change", (newAppState) => {
            if(newAppState === 'background'){
              FirebaseFunctions.setUserActiveState(user.uid, true, 'away')
            }
          })
          FirebaseFunctions.setUserActiveState(user.uid, true, 'online');
          this.props.navigation.push("TeacherCurrentClass", {
            userID: user.uid,
          });
          return;
        }
      } catch (err) {
        console.log(JSON.stringify(err.toString()));
        ret = false;
      }
    });
    return ret;
  }
=======
	// Checks if a user has been logged in. If a user has, it navigates the correct screen depending if they
	// are a student or a teacher
	const asynUseEffect = async () => {
		let succeeded = await tryInitUser();
		if (!succeeded) {
			setShowOfflineError(true);
			setAlreadyCalled(false);
		}
	};
>>>>>>> ef3710b129cc0b3bbdee990bd7364c9d9bfd3453

	// This method leverages the Firebase Auth API to check if a user is currently logged in
	const tryInitUser = async () => {
		let ret = true;
		await FirebaseFunctions.auth.onAuthStateChanged(async (user) => {
			try {
				if (alreadyCalled === false) {
					setAlreadyCalled(true);
					if (!user) {
						props.navigation.push('LoginScreen');
						return;
					}
					//Makes sure this user is subscribed to a topic
					FirebaseFunctions.fcm.subscribeToTopic(user.uid);
					const student = await FirebaseFunctions.getStudentByID(user.uid);
					if (student !== -1) {
						props.navigation.push('StudentCurrentClass', {
							userID: user.uid,
						});
						return;
					}
					props.navigation.push('TeacherCurrentClass', {
						userID: user.uid,
					});
					return;
				}
			} catch (err) {
				ret = false;
			}
		});
		return ret;
	};

	// Renders the loading screen & sets a screen timeout function in case the async fetch takes too long to load
	setTimeout(() => {
		setAlreadyCalled(false);
		setShowOfflineError(true);
	}, 2000);

	if (showOfflineError === true) {
		return (
			<OfflineEmptyState
				retry={async () => {
					let succeeded = await tryInitUser();
					if (succeeded) {
						setShowOfflineError(false);
					}
				}}
			/>
		);
	} else {
		return (
			<QCView style={screenStyle.container}>
				<View style={FirstScreenLoaderStyle.flexEndView}>
					<ActivityIndicator />
				</View>
				<View style={FirstScreenLoaderStyle.flexStartView}>
					<StatusBar barStyle='default' />
				</View>
			</QCView>
		);
	}
};

export default FirstScreenLoader;
