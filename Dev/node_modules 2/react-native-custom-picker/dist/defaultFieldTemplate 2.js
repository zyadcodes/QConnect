"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_1 = require("react-native");
var defaultFieldTemplate = function (_a) {
    var getLabel = _a.getLabel, defaultText = _a.defaultText, selectedItem = _a.selectedItem, clear = _a.clear, containerStyle = _a.containerStyle, textStyle = _a.textStyle, clearImage = _a.clearImage;
    return (React.createElement(react_native_1.View, { style: [
            {
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 10
            },
            containerStyle
        ] },
        React.createElement(react_native_1.Text, { style: textStyle }, (selectedItem && getLabel(selectedItem)) || defaultText),
        selectedItem && (React.createElement(react_native_1.TouchableOpacity, { style: {
                width: 40,
                height: 40,
                padding: 12
            }, onPress: clear }, clearImage || (React.createElement(react_native_1.Image, { style: { width: 16, height: 16 }, source: {
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEUAAAA0SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV40SV4ZONdZAAAAJnRSTlMAAQIDBAUGBwgRFRYZGiEjQ3l7hYaqtLm8vsDFx87a4uvv8fP1+bbY9ZEAAAB8SURBVBhXXY5LFoJAAMOCIP4VBRXEv5j7H9HFDOizu2TRFljedgCQHeocWHVaAWStXnKyl2oVWI+kd1XLvFV1D7Ng3qrWKYMZ+MdEhk3gbhw59KvlH0eTnf2mgiRwvQ7NW6aqNmncukKhnvo/zzlQ2PR/HgsAJkncH6XwAcr0FUY5BVeFAAAAAElFTkSuQmCC'
            } }))))));
};
exports.default = defaultFieldTemplate;
//# sourceMappingURL=defaultFieldTemplate.js.map