// This file will contain the helper functions that will be used in the TeacherWelcomeScreen
import teacherImages from 'config/teacherImages';

const getRandomGenderNeutralImage = () => {
	index = Math.floor(Math.random() * Math.floor(teacherImages.genderNeutralImages.length));
	imageIndex = teacherImages.genderNeutralImages[index];
	return imageIndex;
};

const getRandomMaleImage = () => {
	index = Math.floor(Math.random() * Math.floor(teacherImages.maleImages.length));
	imageIndex = teacherImages.maleImages[index];
	return imageIndex;
};

const getRandomFemaleImage = () => {
	index = Math.floor(Math.random() * Math.floor(teacherImages.femaleImages.length));
	imageIndex = teacherImages.femaleImages[index];
	return imageIndex;
};

initialDefaultImageId = this.getRandomGenderNeutralImage();

const getHighlightedImages = () => {
	defaultImageId = getRandomGenderNeutralImage;

	// get a second gender neutral image, make sure it is different than the first one
	do {
		secondGenericImageId = getRandomGenderNeutralImage();
	} while (secondGenericImageId === defaultImageId);

	// initialize the array of suggested images
	let proposedImages = [
		defaultImageId,
		secondGenericImageId,
		getRandomFemaleImage(),
		getRandomMaleImage(),
	];
	return proposedImages;
};

// Exports the functions as named functions
export {
	getRandomFemaleImage,
	getRandomMaleImage,
	getHighlightedImages,
	getRandomGenderNeutralImage,
};
