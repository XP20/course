import React, { useState } from "react";
import { Button, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { Login, Register } from "../../controllers/ControllerUser";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#212121",
		alignItems: "center",
		paddingTop: 24,
	},
	bottomButtons: {
		width: "80%",
		justifyContent: "space-between",
		height: 80,
		marginBottom: 24,
		alignSelf: "center",
	},
	textInput: {
		borderRadius: 8,
		width: "80%",
		height: 40,
		paddingHorizontal: 12,
		marginBottom: 16,
		marginTop: 8,
		backgroundColor: "#ffffff12",
	},
});

// eslint-disable-next-line react/prop-types
export const ScreenRegister = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onGoBack = () => {
		navigation.navigate("Login");
	};

	const onRegister = async () => {
		let response = await Register(username, password);
		if (response.is_success) {
			// eslint-disable-next-line react/prop-types
			navigation.navigate("Login");
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#212121" }}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<Text>Username:</Text>
				<TextInput style={styles.textInput} onChangeText={setUsername} />
				<Text>Password:</Text>
				<TextInput
					style={styles.textInput}
					onChangeText={setPassword}
					autoCapitalize="none"
					autoCorrect={false}
					secureTextEntry={true}
					textContentType="password"
				/>
			</View>
			<View style={styles.bottomButtons}>
				<Button title="Go back" onPress={onGoBack} />
				<Button title="Register" onPress={onRegister} />
			</View>
		</SafeAreaView>
	);
};
