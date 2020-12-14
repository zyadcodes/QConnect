import React from "react";
import { View, StyleSheet } from "react-native";
import { AirbnbRating } from "react-native-elements";

const EvaluationRating = props => {
  return (
    <View accessibilityLabel="rating_view" style={styles.ratingContainer}>
      <AirbnbRating
        defaultRating={props.rating}
        size={30}
        showRating={false}
        onFinishRating={props.onFinishRating}
        isDisabled={props.readOnly}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    paddingVertical: 15
  }
});

export default EvaluationRating;
