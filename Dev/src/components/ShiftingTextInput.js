import React, { Component } from "react";
import { TextInput, View } from 'react-native'
export default class ShiftingTextInput extends Component {
    state = {
        arrInputs: [],
        TextInput: '',
        refs: []
    }
    goForwardOrBack(i, text){
        if(text == ''){
            if(i > 0){
                let arr = this.state.arrTextInputs;
                arr[i] = text;
                this.setState({arrTextInputs: arr});
                this.state.refs[i-1].current.focus();
            }
        }else{
            if(i < this.state.arrInputs.length-1){
                let arr = this.state.arrTextInputs;
                arr[i] = text;
                this.setState({arrTextInputs: arr});
                this.state.refs[i+1].current.focus();
            }
        }
        this.props.onChangeText();
    }
    componentDidMount(){
        let arr = [];
        let refs = [];
        for(var i = 0; i < this.props.numInputs; i++){
            //textIns[i] = '';
            refs[i] = React.createRef();
            arr[i] = <TextInput placeholder={i} autoCorrect={this.props.autoCorrect} key={i} ref={this.state.refs[i]} onChangeText={(text) => this.goForwardOrBack(i, text)} value={this.props.value.substring(i, i+1)} style={[{borderBottomWidth: 2, borderBottomColor: '#000000'}, this.props.style]}/>;
        }
        this.setState({arrInputs: arr, TextInput: this.props.value, refs});
    }
    render(){
        return (
            <View>
                {this.state.arrInputs}
            </View>
        )
    }
}