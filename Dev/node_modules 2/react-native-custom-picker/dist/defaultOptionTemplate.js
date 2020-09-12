"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_1 = require("react-native");
var defaultOptionTemplate = function (_a) {
    var item = _a.item, getLabel = _a.getLabel, textStyle = _a.textStyle, containerStyle = _a.containerStyle;
    return (React.createElement(react_native_1.View, { style: [
            {
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10
            },
            containerStyle
        ] },
        React.createElement(react_native_1.Text, { style: textStyle }, getLabel(item))));
};
exports.default = defaultOptionTemplate;
//# sourceMappingURL=defaultOptionTemplate.js.map