import {
	Button,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React, { useState } from "react";
import DocumentPicker, { DocumentPickerResponse } from "react-native-document-picker";
import { SendAttachments } from "../../controllers/ControllerAttachment";

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
	attachmentText: {
		color: "#afafaf",
		fontSize: 18,
		flex: 1,
	},
	removeAttachment: {
		color: "#f66",
		fontSize: 18,
	},
	attachmentList: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-evenly",
		width: "80%",
		marginBottom: 16,
	},
	bottomButtons: {
		width: "80%",
		justifyContent: "space-between",
		height: 80,
		marginBottom: 24,
		alignSelf: "center",
	},
});

// eslint-disable-next-line react/prop-types
export const ScreenAttachments = ({ route }) => {
	const [selectedAttachments, setSelectedAttachments] = useState<DocumentPickerResponse[]>([]);

	let sessionToken = route.params.session_token;

	const onSelectAttachment = async () => {
		const newAttachments = await DocumentPicker.pick();
		setSelectedAttachments([...selectedAttachments, ...newAttachments]);
	};

	const onRemoveAttachment = (idx: number) => {
		let updatedAttachments = [...selectedAttachments];
		updatedAttachments.splice(idx, 1);
		setSelectedAttachments(updatedAttachments);
	};

	const onSubmit = async () => {
		await SendAttachments(selectedAttachments, sessionToken);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#212121" }}>
			<StatusBar barStyle="dark-content" />
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
				<View style={styles.container}>
					<Text
						style={{
							...styles.h1,
						}}>
						Attachment uploader
					</Text>
					{selectedAttachments.length > 0 && (
						<View>
							{selectedAttachments.map((attachment, idx) => (
								<View key={`${idx}-${attachment.uri}-view`} style={styles.attachmentList}>
									<Text key={`${idx}-${attachment.uri}-text`} style={styles.attachmentText}>
										{attachment.name}
									</Text>
									<Pressable
										key={`${idx}-${attachment.uri}-pressable`}
										onPress={() => {
											onRemoveAttachment(idx);
										}}>
										<Text key={`${idx}-${attachment.uri}-button`} style={styles.removeAttachment}>
											X
										</Text>
									</Pressable>
								</View>
							))}
						</View>
					)}
				</View>
			</ScrollView>
			<View style={styles.bottomButtons}>
				<Button title="Add attachment" onPress={onSelectAttachment} />
				<Button title="Submit" onPress={onSubmit} />
			</View>
		</SafeAreaView>
	);
};
