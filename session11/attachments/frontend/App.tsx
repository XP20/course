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
import { ScreenAttachments } from "./src/views/screens/ScreenAttachments";
import { ScreenLogin } from "./src/views/screens/ScreenLogin";
import { ScreenRegister } from "./src/views/screens/ScreenRegister";

const Stack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer theme={DarkTheme}>
			<Stack.Navigator>
				<Stack.Screen name="Login" component={ScreenLogin} options={{ title: "Login" }} />
				<Stack.Screen name="Register" component={ScreenRegister} options={{ title: "Register" }} />
				<Stack.Screen
					name="Attachments"
					component={ScreenAttachments}
					options={{ title: "Attachments" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
