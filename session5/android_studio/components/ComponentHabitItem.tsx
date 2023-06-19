import React from "react"
import {View, Text, Button, TextInput, Keyboard, Pressable} from "react-native"
import { Habit } from "../models/habit";

interface Props {
    habit: Habit;
    onDelete: (habit: Habit) => void;
    onEdit: (habit: Habit) => void;
}

interface State {
}

export class ComponentHabitItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    onDelete = () => {
        if(this.props.onDelete) {
            this.props.onDelete(this.props.habit);
        }
    }

    onEdit = () => {
        if(this.props.onEdit) {
            this.props.onEdit(this.props.habit);
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
                <Text style={{
                    marginTop: 8,
                    fontSize: 16,
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
                    }} onPress={this.onEdit}>
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