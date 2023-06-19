import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenHabits } from './screens/ScreenHabits';

export default function App() {
	return (
		<View style={styles.container}>
			<ScreenHabits/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 30,
		marginHorizontal: 20
	},
});
