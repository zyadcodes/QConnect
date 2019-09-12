module.exports = {
    project: {
        ios: {},
        android: {}, // grouped into "project"
    },
    assets: [
        "./assets/fonts/",
        "./assets/images/",
        "./config/fonts.js"
    ],
    dependencies: {
        'react-native-gesture-handler': {
            platforms: {
                ios: null,
                android: null
            },
        },
        'react-native-firebase': {
            platforms: {
                ios: null,
                android: null
            },
        },
        'react-native-reanimated': {
            platforms: {
                ios: null,
                android: null
            },
        },
        'react-native-vector-icons': {
            platforms: {
                ios: null,
                android: null
            },
        },
    },
};