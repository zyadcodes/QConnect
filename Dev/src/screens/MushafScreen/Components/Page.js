import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import colors from 'config/colors';
import Ayah from './Ayah';
import LoadingSpinner from 'components/LoadingSpinner';
import {getPageText} from '../ServiceActions/getQuranContent'

//Creates the higher order component
class Page extends React.Component {

    state = {
        isLoading: true,
        ayats: []
    }

    async componentDidMount() {
        const ayats =  await getPageText(20)
        this.setState({
            isLoading: false,
            ayats
        });
    }

    render() {
        const { isLoading, ayats } = this.state;
        if (isLoading === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )
        }

        else {
            return (
                <View style={{ margin: 5, backgroundColor: colors.white }}>
                    <Text style={styles.ayahText}>
                        {
                            ayats !== undefined &&
                            ayats.map((aya) => {
                                return (
                                    <Ayah
                                        key={aya.index}
                                        text={aya.text}
                                        number={aya.aya}
                                    />
                                )
                            })}
                    </Text>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    ayahText: {
        textAlign: 'right',
        fontFamily: 'me_quran',
        fontSize: 20,
        color: colors.darkGrey
    }
})

export default Page;