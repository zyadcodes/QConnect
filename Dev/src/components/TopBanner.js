//Component represents a top banner that will have three components within it,
//an icon, a title, and another icon that will all be equally seperated
import FontLoadingComponent from './FontLoadingComponent';
import React from 'React';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from 'config/colors'
import fontStyles from '../../config/fontStyles';

class TopBanner extends FontLoadingComponent {
    render() {
        //Component properties
        const { LeftIconName, LeftTextName, LeftOnPress, Title,
            RightIconName, RightTextName, RightOnPress } = this.props;

        return (
            <View>
                {this.state.fontLoaded ? (
                    <View style={styles.entireTopView}>
                        <View style={{flex: 0.5}}/>
                        <View style={styles.topLeftView}  >
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', height: 100, justifyContent: 'flex-start', alignItems: 'center' }} onPress={LeftOnPress ? () => { LeftOnPress() } : () => {}} >
                                <Icon
                                    name={LeftIconName}
                                    type="font-awesome"
                                />
                                <Text style={fontStyles.mainTextStyleBlack}
                                    onPress={LeftOnPress ? () => { LeftOnPress() } : () => {}}>{LeftTextName}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.topMiddleView}>
                            <Text style={fontStyles.bigTextStylePrimaryDark}>{Title}</Text>
                        </View>

                        <View style={styles.topRightView} >
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row',  height: 100, justifyContent: 'flex-end', alignItems: 'center' }} onPress={RightOnPress ? () => { RightOnPress() } : () => {}}>
                                <Icon
                                    name={RightIconName}
                                    type="font-awesome"
                                />
                                <Text style={fontStyles.mainTextStyleBlack}
                                    onPress={RightOnPress ? () => { RightOnPress() } : () => {}}>{RightTextName}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.5}}/>
                    </View>
                ) : (
                        <View></View>
                    )}
            </View>
        );
    }
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

const styles = StyleSheet.create({
    entireTopView: {
        height: 83.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: colors.white,
        borderBottomWidth: 0.25,
        borderBottomColor: colors.black,
    },
    topLeftView: {
        flex: 1.5
    },
    topMiddleView: {
        height: 100,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        flex: 10
    },
    topRightView: {
        flex: 1.5,
        justifyContent: 'center'
    },
});
export default TopBanner;