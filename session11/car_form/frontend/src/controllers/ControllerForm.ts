import axios from "axios";
import { RequestSendListing } from "../../../backend/src/models/messages/RequestSendListing";
import { RequestGetListing } from "../../../backend/src/models/messages/RequestGetListing";
import { RequestGetListingPdf } from "../../../backend/src/models/messages/RequestGetListingPdf";
import { ResponseSendListing } from "../../../backend/src/models/messages/ResponseSendListing";
import { ResponseGetListing } from "../../../backend/src/models/messages/ResponseGetListing";
import { ResponseGetListingPdf } from "../../../backend/src/models/messages/ResponseGetListingPdf";
import { DbListing } from "../../../backend/src/models/db/DbListing";

const API_URL = "http://127.0.0.1:8000";
const FORM_UPLOAD_URL = `${API_URL}/listings/add`;
const FORM_GET_URL = `${API_URL}/listings/get`;
const FORM_GETPDF_URL = `${API_URL}/listings/getpdf`;

const AXIOS_JSON_CONFIG = {
	headers: {
		"Content-Type": "application/json",
		"accept": "application/json",
	},
};

export async function SendForm(
	session_token: string,
	make: string,
	year: number,
	mileage: number,
	description: string,
	price: number,
): Promise<ResponseSendListing> {
	let response = {
		is_success: false,
		list_id: 0,
	} as ResponseSendListing;

	try {
		let body = {
			session_token: session_token,
			make: make.trim(),
			year: year,
			mileage: mileage,
			description: description.trim(),
			price: price,
		} as RequestSendListing;
		let query = await axios.post(FORM_UPLOAD_URL, body, AXIOS_JSON_CONFIG);
		response = query.data as ResponseSendListing;
	} catch (err) {
		console.error(err);
	}

	return response;
}

export async function GetForm(list_id: number, session_token: string): Promise<ResponseGetListing> {
	let response = {
		is_success: false,
		form: {
			list_id: 0,
			make: "",
			year: 0,
			mileage: 0,
			description: "",
			price: 0,
			created: new Date(),
			user_id: 0,
			is_deleted: true,
		} as DbListing,
	} as ResponseGetListing;

	try {
		let body = {
			session_token: session_token,
			list_id: list_id,
		} as RequestGetListing;
		let query = await axios.post(FORM_GET_URL, body, AXIOS_JSON_CONFIG);
		response = query.data as ResponseGetListing;
	} catch (err) {
		console.error(err);
	}

	return response;
}

export async function GetFormPdf(
	list_id: number,
	session_token: string,
): Promise<ResponseGetListingPdf> {
	let response = {
		is_success: false,
		url: "",
	} as ResponseGetListingPdf;

	try {
		let body = {
			session_token: session_token,
			list_id: list_id,
		} as RequestGetListingPdf;

		let query = await axios.post(FORM_GETPDF_URL, body, AXIOS_JSON_CONFIG);
		response = query.data as ResponseGetListingPdf;
	} catch (err) {
		console.error(err);
	}

	return response;
}
