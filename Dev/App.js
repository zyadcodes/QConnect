import React, { useState, useEffect } from 'react';
import MainStackNavigator from './src/screens/MainStackNavigator';
import { Alert, ScrollView, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import QCView from 'QCView/QCView';
import screenStyle from 'config/screenStyle';
import strings from 'config/strings';
import { checkNotifications, requestNotifications } from 'react-native-permissions';
import FirebaseFunctions from 'config/FirebaseFunctions';
import OfflineEmptyState from './src/components/OfflineEmptyState/OfflineEmptyState';

//Declares the functional component
const App = (props) => {
	// The state fields used in this component
	const [requestingPermissions, setRequestingPermissions] = useState(true);
	const [isOnline, setIsOnline] = useState(true);
	const [retry, setRetry] = useState(0);

	// This method actts as the componentDidMount method. It is called once when the component is first mounted
	useEffect(() => {
		// useEffect hook can't take async function, so it calls a helper function
		asyncUseEffect();
	}, []);

	// The helper function handles the asynchronous tasks of the useEffect hook
	const asyncUseEffect = async () => {
		const isPermissionsGranted = await checkNotifications();
		if (isPermissionsGranted !== 'granted') {
			await requestNotifications(['alert', 'sound', 'badge']);
		}
		setRequestingPermissions(false);
	};

	// This method gets called by the offline state in order to keep trying to connect to the internet and move on
	const onRetry = async () => {
		let nstate = await NetInfo.fetch();
		if (nstate.isConnected !== isOnline) {
			setIsOnline(nstate.isConnected);
		}
		// Change a dummy state variable to force re-mount / retry
		setRetry(retry + 1);
	};

	// Returns the UI of the app. Handles errors as need be
	try {
		return (
			<ScrollView
				contentContainerStyle={{
					flex: 1,
				}}>
				{isOnline ? (
					requestingPermissions === false ? (
						<MainStackNavigator />
					) : (
						<View />
					)
				) : (
					<OfflineEmptyState retry={() => onRetry()} />
				)}
			</ScrollView>
		);
	} catch (error) {
		if (isOnline) {
			FirebaseFunctions.logEvent('FATAL_ERROR', { error });
		}
		Alert.alert(strings.Whoops, strings.SomethingWentWrong);
		return <QCView style={screenStyle.container} />;
	}
};

// Exports the funcitional component
export default App;
