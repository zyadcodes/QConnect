import React from "react";
import studentImages from "config/studentImages";
import Header from "components/Header";
import TopBanner from "components/TopBanner";
import strings from "config/strings";

/**
 *
 * @param {newAssignment, assignmentType, assignmentName, avatarName, profileImageID, closeScreen, readOnly, isStudentSide, enableEditMode} props
 */

const EvaluationHeader = props => {
  // ------------------------- header section ----------------------
  if (props.newAssignment === true) {
    return (
      <Header
        title={props.assignmentType}
        subtitle={props.assignmentName}
        avatarName={props.avatarName}
        avatarImage={studentImages.images[props.profileImageID]}
        onClose={props.closeScreen}
      />
    );
  } else if (props.readOnly === true && !props.isStudentSide) {
    return (
      <TopBanner
        LeftIconName="angle-left"
        LeftOnPress={props.closeScreen}
        Title={strings.Evaluation}
        RightIconName="edit"
        RightOnPress={props.enableEditMode}
      />
    );
  } else {
    return (
      <Header
        title={props.assignmentType}
        avatarName={props.avatarName}
        subtitle={props.assignmentName}
        avatarImage={studentImages.images[props.profileImageID]}
        onClose={props.closeScreen}
      />
    );
  }

  // ----------------- end of header section ------------------------------)
};
export default EvaluationHeader;
