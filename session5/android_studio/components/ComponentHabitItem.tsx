import React, { useEffect, useRef } from "react"
import {View, Text, Button, TextInput, Keyboard, Pressable} from "react-native"
import { Habit } from "../models/habit";

interface Props {
    habit: Habit;
    onDelete: (habit: Habit) => void;
    onEdit: (habit: Habit, newValue: string) => void;
}

interface State {
    editing: boolean;
    editedValue: string;
}

export class ComponentHabitItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editing: false,
            editedValue: this.props.habit.title,
        };
    }

    onDelete = () => {
        if(this.props.onDelete) {
            this.props.onDelete(this.props.habit);
        }
    }

    onEdit = (newValue: string) => {
        if(this.props.onEdit) {
            this.props.onEdit(this.props.habit, newValue);
        }
    }

    render = () => {
        return <View style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: 'rgba(53, 59, 57, 1)',
            backgroundColor: 'rgba(53, 59, 57, 0.05)',
            marginBottom: 10,
        }}>
            <View style={{
                flexDirection: 'row',
                marginHorizontal: 20,
                justifyContent: 'space-between',
            }}>
                <TextInput
                    style={{
                        marginVertical: 5,
                        fontSize: 16,
                        height: 30,
                        display: this.state.editing ? 'flex' : 'none',
                        borderWidth: 1,
                    }}
                    value={this.state.editedValue}
                    onChangeText={(newValue) => {
                        let editing = this.state.editing;
                        this.setState({
                            editing: editing,
                            editedValue: newValue,
                        });
                    }}
                    onEndEditing={() => {
                        let editedValue = this.state.editedValue;
                        this.props.onEdit(this.props.habit, editedValue);
                        this.setState({
                            editing: false,
                            editedValue: editedValue,
                        });
                    }}
                    onSubmitEditing={(value) => {
                        let editedValue = this.state.editedValue;
                        this.props.onEdit(this.props.habit, editedValue);
                        this.setState({
                            editing: false,
                            editedValue: editedValue,
                        });
                    }}
                />
                <Text style={{
                    marginTop: 8,
                    fontSize: 16,
                    height: 32,
                    display: `${this.state.editing ? 'none' : 'flex'}`,
                }}>{this.props.habit.title}</Text>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <Pressable style={{
                        backgroundColor: 'rgba(36, 156, 116, 0.25)',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderWidth: 1,
                        borderRadius: 8,
                        marginTop: 5,
                        marginBottom: 5,
                    }} onPress={() => {
                        this.setState({
                            editing: true
                        });
                        // if(editRef !== null) {
                        //     editRef.focus();
                        // }
                    }}>
                        <Text>Edit</Text>
                    </Pressable>
                    <Pressable style={{
                        backgroundColor: 'rgba(200, 20, 80, 0.25)',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderWidth: 1,
                        borderRadius: 8,
                        margin: 5,
                    }} onPress={this.onDelete}>
                        <Text>X</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    }
}