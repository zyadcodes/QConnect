import React from 'react'
import { Image, TouchableHighlight } from 'react-native'
import PropTypes from 'prop-types'
import colors from 'config/colors';
import { screenWidth } from 'config/dimensions';

//--------------------------------------------------------------------------
// A Touchable round image . Default size depends on whether the image is "selected"
// Used to make the selected avatar displays larger than other ones. And allow pressing
// on any avatar to select it.
//----------------------------------------------------------------------------
export default TouchableAvatar = (props) => {
  const { image, onPress, index, selected } = props;
  const backColor = props.backgroundColor ? props.backgroundColor : (selected ? colors.primaryLight : colors.white);
  let imgDiameter = screenWidth / 7;
  const length = props.length ? props.length : (selected ? imgDiameter + 10 : imgDiameter);


  return (
    <TouchableHighlight
      style={{
        backgroundColor: backColor,
        borderRadius: 40
      }}
      onPress={onPress}>
      <Image
        key={index}
        source={image}
        backgroundColor={backColor}
        resizeMode='cover'
        style={{
          borderRadius: length / 2,
          width: length,
          height: length,
          alignItems: "center",
          justifyContent: "center",
          margin: 5,
        }}
      />
    </TouchableHighlight>
  );
}

TouchableAvatar.propTypes = {
  image: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  length: PropTypes.number,
  selected: PropTypes.bool,
  index: PropTypes.number,
}