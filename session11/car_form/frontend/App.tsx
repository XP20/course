/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ScreenLogin } from "./src/views/screens/ScreenLogin";
import { ScreenRegister } from "./src/views/screens/ScreenRegister";
import { ScreenForm } from "./src/views/screens/ScreenForm";
import { ScreenListing } from "./src/views/screens/ScreenListing";

const Stack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer theme={DarkTheme}>
			<Stack.Navigator>
				<Stack.Screen name="Login" component={ScreenLogin} options={{ title: "Login" }} />
				<Stack.Screen name="Register" component={ScreenRegister} options={{ title: "Register" }} />
				<Stack.Screen name="Form" component={ScreenForm} options={{ title: "Car Form" }} />
				<Stack.Screen name="Listing" component={ScreenListing} options={{ title: "Car Listing" }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
