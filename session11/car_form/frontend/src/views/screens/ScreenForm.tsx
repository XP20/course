import {
	Button,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
} from "react-native";
import React, { useMemo, useState } from "react";
import * as _ from "lodash";
import DropDownPicker from "react-native-dropdown-picker";
import carInfo from "../../cars.json";
import { GetForm, SendForm } from "../../controllers/ControllerForm";

const CAR_YEARS = 50;
const ERROR_MSG = "Something went wrong, try again later!";
const EMPTY_MSG = "Please fill all fields before submitting!";

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
		color: "#fff",
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
	textInput: {
		borderRadius: 8,
		width: 240,
		height: 40,
		paddingHorizontal: 12,
		marginBottom: 8,
		backgroundColor: "rgba(60,77,143,0.26)",
		borderWidth: 1,
		textAlignVertical: "top",
	},
});

// eslint-disable-next-line react/prop-types
export const ScreenForm = ({ navigation, route }) => {
	const [make, setMake] = useState(null);
	const [year, setYear] = useState(null);
	const [price, setPrice] = useState(0);
	const [mileage, setMileage] = useState(0);
	const [description, setDescription] = useState("");

	const [makeOpen, setMakeOpen] = useState(false);
	const [yearOpen, setYearOpen] = useState(false);

	const makeOptions = _.map(carInfo, (value, index) => ({
		value: value.brand,
		label: value.brand,
	}));

	const yearOptions = useMemo(() => {
		let currentYear = new Date().getFullYear();
		let startYear = currentYear - CAR_YEARS;
		const years = _.range(startYear, currentYear + 1);

		const mappedYears = _.map(years, (value, index) => ({
			value: value,
			label: value.toString(),
		}));

		return _.reverse(mappedYears);
	}, []);

	// eslint-disable-next-line react/prop-types
	let sessionToken = route.params.session_token;

	const onSubmit = async () => {
		if (make !== null && year !== null && price !== 0) {
			const response = await SendForm(sessionToken, make, year, mileage, description, price);
			if (response.is_success) {
				const listing = await GetForm(response.list_id, sessionToken);
				if (listing.is_success) {
					const { form } = listing;

					// eslint-disable-next-line react/prop-types
					navigation.navigate("Listing", {
						make: form.make,
						year: form.year,
						mileage: form.mileage,
						description: form.description,
						price: form.price,
						session_token: sessionToken,
						list_id: listing.form.list_id,
					});
				}
			} else {
				// eslint-disable-next-line no-alert
				alert(ERROR_MSG);
			}
		} else {
			// eslint-disable-next-line no-alert
			alert(EMPTY_MSG);
		}
	};

	DropDownPicker.setTheme("DARK");
	DropDownPicker.setListMode("SCROLLVIEW");

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#212121" }}>
			<StatusBar barStyle="dark-content" />
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
				<KeyboardAvoidingView style={styles.container} behavior="position">
					<Text style={styles.formText}>Make:</Text>
					<DropDownPicker
						open={makeOpen}
						value={make}
						items={makeOptions}
						setOpen={(open) => {
							setMakeOpen(open);
							if (open) {
								setYearOpen(false);
							}
						}}
						setValue={setMake}
						zIndex={100}
						style={styles.formElement}
						containerStyle={styles.formElement}
					/>
					<Text style={styles.formText}>Year:</Text>
					<DropDownPicker
						open={yearOpen}
						value={year}
						items={yearOptions}
						setOpen={(open) => {
							setYearOpen(open);
							if (open) {
								setMakeOpen(false);
							}
						}}
						setValue={setYear}
						zIndex={90}
						style={styles.formElement}
						containerStyle={styles.formElement}
					/>
					<Text style={styles.formText}>Mileage:</Text>
					<TextInput
						style={styles.textInput}
						keyboardType="numeric"
						onChangeText={(text) => {
							setMileage(+text);
						}}
						value={mileage.toString()}
					/>
					<Text style={styles.formText}>Description:</Text>
					<TextInput
						style={{ ...styles.textInput, height: "auto" }}
						numberOfLines={6}
						onChangeText={setDescription}
						value={description}
						multiline={true}
					/>
					<Text style={styles.formText}>Price:</Text>
					<TextInput
						style={styles.textInput}
						keyboardType="numeric"
						onChangeText={(text) => {
							setPrice(+text);
						}}
						value={price.toString()}
					/>
					<View
						style={{
							marginTop: 32,
						}}>
						<Button title="Submit" onPress={onSubmit} />
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};
