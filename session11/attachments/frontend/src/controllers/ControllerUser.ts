import uuid from "react-native-uuid";
import axios from "axios";
import RNFS from "react-native-fs";
import { DocumentPickerResponse } from "react-native-document-picker";
import { RequestSendAttachment } from "../../../backend/src/models/messages/RequestSendAttachment";
import { ResponseSendAttachment } from "../../../backend/src/models/messages/ResponseSendAttachment";
import { RequestLogin } from "../../../backend/src/models/messages/RequestLogin";
import { ResponseLogin } from "../../../backend/src/models/messages/ResponseLogin";
import { ResponseRegister } from "../../../backend/src/models/messages/ResponseRegister";
import { RequestRegister } from "../../../backend/src/models/messages/RequestRegister";
import { DbAttachment } from "../../../backend/src/models/db/DbAttachment";

const API_URL = "http://127.0.0.1:8000";
const LOGIN_URL = `${API_URL}/user/login`;
const REGISTER_URL = `${API_URL}/user/register`;

const AXIOS_JSON_CONFIG = {
	headers: {
		"Content-Type": "application/json",
		"accept": "application/json",
	},
};

export async function Login(username: string, password: string): Promise<ResponseLogin> {
	let response = {
		session_token: "",
		is_success: false,
	} as ResponseLogin;

	try {
		let body = {
			username: username.trim(),
			password: password.trim(),
		} as RequestLogin;
		let query = await axios.post(LOGIN_URL, body, AXIOS_JSON_CONFIG);
		response = query.data as ResponseLogin;
	} catch (err) {
		console.error(err);
	}

	return response;
}

export async function Register(username: string, password: string): Promise<ResponseRegister> {
	let response = {
		is_success: false,
		code: "Register failed!",
	} as ResponseRegister;

	try {
		let body = {
			username: username.trim(),
			password: password.trim(),
		} as RequestRegister;
		let query = await axios.post(REGISTER_URL, body, AXIOS_JSON_CONFIG);
		response = query.data as ResponseRegister;
	} catch (err) {
		console.error(err);
	}

	return response;
}
