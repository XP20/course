import React from "react"
import {View, Text, Button, TextInput, Keyboard, ScrollView} from "react-native"
import { ComponentHabitItem } from "../components/ComponentHabitItem";
import { Habit } from "../models/habit";

interface Props {
    title?: string;
}

interface State {
    habits: Habit[];
    currentHabit: string;
}

export class ScreenHabits extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            habits: [],
            currentHabit: ''
        };
    }

    onAddHabit = () => {
        let habits = this.state.habits;
        let title = this.state.currentHabit
        habits.push({
            title: title
        } as Habit);
        this.setState({
            habits: habits,
            currentHabit: ''
        });
        Keyboard.dismiss();
    }

    onDeleteHabit = (habit: Habit) => {
        let habits = this.state.habits;
        let idx = habits.indexOf(habit);
        habits.splice(idx, 1);
        this.setState({
            habits: habits
        });
    }

    onEditHabit = (habit: Habit, newValue: string) => {
        let habits = this.state.habits;
        habit.title = newValue;
        this.setState({
            habits: habits
        });
        Keyboard.dismiss();
    }

    render = () => {
        return <View 
            style={{
                flex: 1, 
                marginVertical: 20,
            }}>
            <View style={{
                flex: 1,
                marginBottom: 20,
            }}>
                <ScrollView
                    style={{
                        marginHorizontal: -20
                    }}>
                    {this.state.habits.map((habit, i) => 
                        <ComponentHabitItem
                            key={`habit-${i}`} 
                            habit={habit}
                            onDelete={this.onDeleteHabit}
                            onEdit={this.onEditHabit}/>
                    )}
                </ScrollView>
            </View>
            <TextInput
                style={{
                    borderWidth: 1,
                    marginBottom: 10
                }} 
                value={this.state.currentHabit} 
                onChangeText={(newValue) => this.setState({
                    currentHabit: newValue
                })}/>
            <Button title={"Add habit"} onPress={this.onAddHabit}></Button>
        </View>;
    }
}