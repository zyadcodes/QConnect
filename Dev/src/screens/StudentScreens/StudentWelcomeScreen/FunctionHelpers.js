// This file will "named export" all of the image functions that are used in the StudentWelcomeScreen
import studentImages from 'config/studentImages';

const getRandomGenderNeutralImage = () => {
	index = Math.floor(Math.random() * Math.floor(studentImages.genderNeutralImages.length));
	imageIndex = studentImages.genderNeutralImages[index];
	return imageIndex;
};

const getRandomMaleImage = () => {
	index = Math.floor(Math.random() * Math.floor(studentImages.maleImages.length));
	imageIndex = studentImages.maleImages[index];
	return imageIndex;
};

const getRandomFemaleImage = () => {
	index = Math.floor(Math.random() * Math.floor(studentImages.femaleImages.length));
	imageIndex = studentImages.femaleImages[index];
	return imageIndex;
};

const getHighlightedImages = () => {
	defaultImageId = getRandomGenderNeutralImage();

	// get a second gender neutral image, make sure it is different than the first one
	do {
		secondGenericImageId = getRandomGenderNeutralImage();
	} while (secondGenericImageId === defaultImageId);

	//initialize the array of suggested images
	let proposedImages = [
		defaultImageId,
		secondGenericImageId,
		getRandomFemaleImage(),
		getRandomMaleImage(),
	];
	return proposedImages;
};

// Exports all the functions as named functions
export {
	getRandomFemaleImage,
	getRandomGenderNeutralImage,
	getRandomMaleImage,
	getHighlightedImages,
};
