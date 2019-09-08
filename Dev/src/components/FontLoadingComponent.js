import React, { Component } from 'react';

class FontLoadingComponent extends Component {
    state = {
        fontLoaded: false,
    };

    async componentDidMount() {

        
        // await Font.loadAsync({
        //     regular: require('assets/fonts/Montserrat-Regular.ttf'),
        //     light: require('assets/fonts/Montserrat-Light.ttf'),
        //     bold: require('assets/fonts/Montserrat-Bold.ttf'),
        // });

        this.setState({ fontLoaded: true });
    }
}

export default FontLoadingComponent;