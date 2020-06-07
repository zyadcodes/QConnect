//Exports a set of named function that can be used any where through out the app. These functions provide a standard
//way of converting dates and interacting with date formats.

//you would import these functions like this: import { convertDateToString } from 'pathto/dateUtils';

//This method will take in a date object, and will convert it to a string in the format YYYY-MM-DD
const convertDateToString = (dateObject) => {
	let year = dateObject.getFullYear();
	let month = dateObject.getMonth() + 1;
	let day = dateObject.getDate();
	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	const dateString = year + '-' + month + '-' + day;

	return dateString;
};

export { convertDateToString };
