//Component represents a top banner that will have three components within it,
//an icon, a title, and another icon that will all be equally seperated
import FontLoadingComponent from './FontLoadingComponent';
import React, { useState } from 'react';
import ImageSelectionModal from 'components/ImageSelectionModal'
import strings from 'config/strings';
import PropTypes from 'prop-types';
import classImages from 'config/classImages'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from 'config/colors'
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import { TextInput } from 'react-native-gesture-handler';
import styles from './TopBannerStyle'

const TopBanner = (props) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [profileImageID, setProfileImageID] = useState(-1)

    const editProfilePic = () => {
        setModalVisible(true);
    }
    const onImageSelected = (index) => {
        setProfileImageID(index)
        setModalVisible(false);
        props.onEditingPicture(index);
    }
        //Component properties
        const { LeftIconName, LeftTextName, LeftOnPress, Title, isEditingTitle, onTitleChanged, isEditingPicture,
            RightIconName, RightTextName, RightOnPress, profilePic, onEditingPicture, profileImageID, } = props;

        return (
            <View  style={styles.container}>
                <View style={styles.entireTopView}>
                    <View style={{ flex: 0.5 }} />
                    <View style={styles.topLeftView} >
                        {(isEditingPicture ?
                            <View>
                                <ImageSelectionModal
                                    visible={state.modalVisible}
                                    images={classImages.images}
                                    cancelText={strings.Cancel}
                                    setModalVisible={setModalVisible.bind(this)}
                                    onImageSelected={onImageSelected.bind(this)}
                                />
                                <View style={styles.picContainer}>
                                    <Image
                                        style={styles.profilePic}
                                        source={classImages.images[profileImageID]} />
                                </View>
                            </View>
                            :
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', height: screenHeight * 0.15, justifyContent: 'flex-start', alignItems: 'center' }} onPress={LeftOnPress ? () => { LeftOnPress() } : () => { }} >
                                <Icon
                                    name={LeftIconName}
                                    type="font-awesome"
                                />
                                <Text style={fontStyles.mainTextStyleBlack}
                                    onPress={LeftOnPress ? () => { LeftOnPress() } : () => { }}>{LeftTextName}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.topMiddleView}>
                        {(isEditingTitle ?
                            <TextInput
                                value={Title}
                                selectTextOnFocus={true}
                                onChangeText={onTitleChanged}
                                style={{ ...fontStyles.mainTextStyleBlack, paddingVertical: 2, minWidth: screenWidth * 0.40, backgroundColor: colors.lightGrey, borderRadius: 400, textAlign: 'center' }}
                            >
                            </TextInput> :
                            <Text style={fontStyles.bigTextStylePrimaryDark}>{Title}</Text>
                        )}
                    </View>

                    <View style={styles.topRightView} >
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', height: screenHeight * 0.15, justifyContent: 'flex-end', alignItems: 'center' }} onPress={RightOnPress ? () => { RightOnPress() } : () => { }}>
                            <Icon
                                name={RightIconName}
                                type="font-awesome"
                            />
                            <Text style={fontStyles.mainTextStyleBlack}
                                onPress={RightOnPress ? () => { RightOnPress() } : () => { }}>{RightTextName}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 0.5 }} />
                </View>

                
                {isEditingTitle ?
                    <View style={styles.updateImage}>
                    <TouchableText
                        text={"Update Image"}
                        onPress={() => editProfilePic()} />
                    </View> : <View></View> 
                }
                
            </View>
        )
}

//Verifies the propTypes are correct
TopBanner.propTypes = {
    LeftIconName: PropTypes.string,
    LeftTextName: PropTypes.string,
    LeftOnPress: PropTypes.func,
    Title: PropTypes.string,
    RightIconName: PropTypes.string,
    RightTextName: PropTypes.string,
    RightOnPress: PropTypes.func,
}

export default TopBanner;