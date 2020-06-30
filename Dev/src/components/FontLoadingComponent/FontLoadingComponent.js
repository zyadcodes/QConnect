import React, { Component, useEffect, useState } from 'react';


const fontLoaded = false;
const FontLoadingComponent = (props) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {

        
        // await Font.loadAsync({
        //     regular: require('assets/fonts/Montserrat-Regular.ttf'),
        //     light: require('assets/fonts/Montserrat-Light.ttf'),
        //     bold: require('assets/fonts/Montserrat-Bold.ttf'),
        // });

        setFontLoaded(true);
    }, [])
}

export default FontLoadingComponent;