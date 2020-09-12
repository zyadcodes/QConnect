"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-any
var React = require("react");
var react_native_1 = require("react-native");
var defaultFieldTemplate_1 = require("./defaultFieldTemplate");
var defaultOptionTemplate_1 = require("./defaultOptionTemplate");
/**
 * React native customizable picker component
 */
var CustomPicker = /** @class */ (function (_super) {
    __extends(CustomPicker, _super);
    function CustomPicker(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            modalVisible: false,
            selectedItem: _this.defaultWhenEmpty(_this.props.value, _this.props.defaultValue)
        };
        _this.showOptions = _this.showOptions.bind(_this);
        _this.hideOptions = _this.hideOptions.bind(_this);
        _this.selectOption = _this.selectOption.bind(_this);
        _this.clear = _this.clear.bind(_this);
        _this.getLabel = _this.getLabel.bind(_this);
        return _this;
    }
    CustomPicker.prototype.render = function () {
        var _this = this;
        var _a = this.props, containerStyle = _a.containerStyle, modalAnimationType = _a.modalAnimationType, fieldTemplate = _a.fieldTemplate, optionTemplate = _a.optionTemplate, placeholder = _a.placeholder, options = _a.options, headerTemplate = _a.headerTemplate, footerTemplate = _a.footerTemplate, style = _a.style, fieldTemplateProps = _a.fieldTemplateProps, optionTemplateProps = _a.optionTemplateProps, backdropStyle = _a.backdropStyle, modalStyle = _a.modalStyle, refreshControl = _a.refreshControl, scrollViewProps = _a.scrollViewProps;
        var actions = {
            getLabel: this.props.getLabel || this.getLabel,
            clear: this.clear,
            open: this.showOptions,
            close: this.hideOptions
        };
        var ft = fieldTemplate;
        var ot = optionTemplate;
        var maxHeight = this.props.maxHeight || react_native_1.Dimensions.get('window').height - 60;
        return (React.createElement(react_native_1.View, { style: containerStyle },
            React.createElement(react_native_1.TouchableOpacity, { onPress: this.showOptions },
                React.createElement(react_native_1.View, { style: style }, ft(__assign({ defaultText: placeholder, selectedItem: this.state.selectedItem }, actions, fieldTemplateProps)))),
            React.createElement(react_native_1.Modal, { transparent: true, visible: this.state.modalVisible, onRequestClose: this.hideOptions, animationType: modalAnimationType },
                React.createElement(react_native_1.TouchableWithoutFeedback, { onPress: this.hideOptions },
                    React.createElement(react_native_1.View, { style: [
                            { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
                            backdropStyle
                        ] },
                        React.createElement(react_native_1.View, { style: [
                                { flex: 1, justifyContent: 'center', paddingHorizontal: 20 }
                            ] },
                            React.createElement(react_native_1.View, { style: [{ backgroundColor: 'white', maxHeight: maxHeight }, modalStyle] },
                                headerTemplate && headerTemplate(actions),
                                React.createElement(react_native_1.ScrollView, __assign({ refreshControl: refreshControl }, scrollViewProps), options.map(function (o, index) { return (React.createElement(react_native_1.TouchableOpacity, { onPress: function () {
                                        _this.selectOption(o, true);
                                    }, key: index }, ot(__assign({ item: o, getLabel: _this.props.getLabel || _this.getLabel }, actions, optionTemplateProps)))); })),
                                footerTemplate && footerTemplate(actions))))))));
    };
    CustomPicker.prototype.componentDidMount = function () {
        var _a = this.props, value = _a.value, defaultValue = _a.defaultValue;
        if (value || defaultValue) {
            this.selectOption(this.defaultWhenEmpty(value, defaultValue), false);
        }
    };
    CustomPicker.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.value !== this.props.value) {
            this.selectOption(nextProps.value, false);
        }
    };
    /**
     * Default getLabel function. A get label from item function.
     * @param item Item value to translate.
     */
    CustomPicker.prototype.getLabel = function (item) {
        return item ? item.toString() : null;
    };
    /**
     * Show modal picker to display options.
     */
    CustomPicker.prototype.showOptions = function () {
        if (this.state.modalVisible) {
            return;
        }
        this.setState({ modalVisible: true }, this.props.onFocus);
    };
    /**
     * Hide options by hiding modal picker.
     */
    CustomPicker.prototype.hideOptions = function () {
        if (!this.state.modalVisible) {
            return;
        }
        this.setState({ modalVisible: false }, this.props.onBlur);
    };
    /**
     * Select an option.
     * @param selectedItem Item/option to select.
     */
    CustomPicker.prototype.selectOption = function (selectedItem, triggerEvent) {
        var _this = this;
        var onValueChange = this.props.onValueChange;
        this.setState({ selectedItem: selectedItem }, function () {
            _this.hideOptions();
            if (triggerEvent && onValueChange) {
                onValueChange(selectedItem);
            }
        });
    };
    /**
     * Clear selected value.
     */
    CustomPicker.prototype.clear = function () {
        var defaultValue = this.props.defaultValue;
        this.selectOption(defaultValue || null, true);
    };
    CustomPicker.prototype.defaultWhenEmpty = function (value, defaultValue) {
        return value === null || value === undefined ? defaultValue : value;
    };
    CustomPicker.defaultProps = {
        fieldTemplate: defaultFieldTemplate_1.default,
        optionTemplate: defaultOptionTemplate_1.default,
        placeholder: 'Pick an item...',
        modalAnimationType: 'none'
    };
    return CustomPicker;
}(React.PureComponent));
exports.CustomPicker = CustomPicker;
//# sourceMappingURL=index.js.map