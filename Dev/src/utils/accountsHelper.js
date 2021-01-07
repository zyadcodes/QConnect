import firebase from "react-native-firebase";
import strings from "config/strings";
import { Alert } from "react-native";

//validate user input when creating a new account
export const validateAccountEntries = async (
  name,
  phoneNumber,
  emailAddress,
  password,
  confirmPassword,
  isPhoneValid,
  setLoadingSpinnner
) => {
  if (
    !name ||
    !phoneNumber ||
    !emailAddress ||
    !password ||
    name.trim() === "" ||
    phoneNumber.trim() === "" ||
    emailAddress.trim() === "" ||
    password.trim() === ""
  ) {
    Alert.alert(strings.Whoops, strings.PleaseMakeSureAllFieldsAreFilledOut);
    return false;
  } else if (!isPhoneValid) {
    Alert.alert(strings.Whoops, strings.InvalidPhoneNumber);
    return false;
  } else if (!emailAddress.includes("@")) {
    Alert.alert(strings.Whoops, strings.BadEmail);
    return false;
  } else if (password.length <= 6) {
    Alert.alert(strings.Whoops, strings.PasswordError);
    return false;
  } else if (password !== confirmPassword) {
    Alert.alert(strings.Whoops, strings.PasswordsDontMatch);
    return false;
  } else {
    setLoadingSpinnner(true);
    const doesThisUserExist = await firebase
      .auth()
      .fetchSignInMethodsForEmail(emailAddress);
    if (doesThisUserExist.length > 0) {
      setLoadingSpinnner(false);
      Alert.alert(strings.Whoops, strings.EmailExists);
      return false;
    } else {
      //account entries are valid..
      return true;
    }
  }
};
