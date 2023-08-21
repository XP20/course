import {
	Button,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
	Text,
	KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { GetFormPdf } from "../../controllers/ControllerForm";
import { DownloadAndOpenFile } from "../../controllers/ControllerFile";

const styles = StyleSheet.create({
	h1: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 24,
	},
	container: {
		flex: 1,
		backgroundColor: "#212121",
		alignItems: "center",
		paddingTop: 24,
	},
	formText: {
		fontSize: 18,
		marginBottom: 6,
		color: "#c1c1c1",
		marginTop: 12,
	},
	bottomButtons: {
		width: "80%",
		justifyContent: "flex-end",
		marginBottom: 24,
		alignSelf: "center",
	},
	formElement: {
		width: 240,
		alignSelf: "center",
		marginBottom: 8,
	},
});

// eslint-disable-next-line react/prop-types
export const ScreenListing = ({ route }) => {
	// eslint-disable-next-line react/prop-types
	const { make, year, price, mileage, description } = route.params;

	// eslint-disable-next-line react/prop-types
	const sessionToken = route.params.session_token;
	// eslint-disable-next-line react/prop-types
	const listId = route.params.list_id;

	const onExportToPdf = async () => {
		let response = await GetFormPdf(listId, sessionToken);
		if (response.is_success) {
			await DownloadAndOpenFile(response.url);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#212121" }}>
			<StatusBar barStyle="dark-content" />
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
				<KeyboardAvoidingView style={styles.container} behavior="position">
					<Text style={styles.formText}>{`Make: ${make}`}</Text>
					<Text style={styles.formText}>{`Year: ${year}`}</Text>
					<Text style={styles.formText}>{`Mileage: ${mileage}`}</Text>
					<Text style={styles.formText}>{`Description: ${description}`}</Text>
					<Text style={styles.formText}>{`Price: ${price}`}</Text>
					<View
						style={{
							marginTop: 32,
						}}>
						<Button title="Export to pdf" onPress={onExportToPdf} />
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};
