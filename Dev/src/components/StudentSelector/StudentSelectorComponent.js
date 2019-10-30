import React, { Component } from 'react'
import { FlatList, View } from "react-native";
import {ListItem} from 'react-native-elements'
import studentImages from 'config/studentImages';
import classImages from 'config/classImages';

class StudentSelectorComponent extends Component {

    getItemAvatar(item, index){
        if(index === 0){
            return classImages.images[item.profileImageID];
        }

        return studentImages.images[item.profileImageID]
    }

    render() {
        const {currentClass, selectedItemID} = this.props;
        
        return (
            <FlatList
                data={currentClass? [{name: 'All "' + currentClass.name + '" class', profileImageID: currentClass.classImageID, ID: currentClass.ID}, ...currentClass.students] : []}
                keyExtractor={(item) => item.name} 
                renderItem={({ item, index }) => (
                    <ListItem
                        title={item.name}
                        leftAvatar={{ rounded: true, size: 40, source: this.getItemAvatar(item, index) }}
                        onPress={() => { 
                            //2nd param indicates whether the ID is for a class. index 0 is always reserved for class
                            this.props.onSelect(item.ID, item.profileImageID, index === 0)
                            }} 
                        bottomDivider
                        checkmark={selectedItemID === item.ID}
                    />
                )
                }
            />
        )
    }
}

export default StudentSelectorComponent;