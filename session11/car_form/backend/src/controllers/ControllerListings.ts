import { Body, Post, Route } from "tsoa";
import { ResponseSendListing } from "../models/messages/ResponseSendListing";
import { RequestSendListing } from "../models/messages/RequestSendListing";
import {DbListing} from "../models/db/DbListing";
import {
	AddListing,
	GetListingById,
	GetSessionByToken,
} from "../services/ServiceDatabase";
import {RequestGetListing} from "../models/messages/RequestGetListing";
import {ResponseGetListing} from "../models/messages/ResponseGetListing";
import {RequestGetListingPdf} from "../models/messages/RequestGetListingPdf";
import {ResponseGetListingPdf} from "../models/messages/ResponseGetListingPdf";
import {GeneratePdfUsingTemplate} from "../services/ServicePdfCreator";
import fs from "fs";
import path from "path";
import {PdfTemplateEntry} from "../models/interfaces/PdfTemplateEntry";
import { v4 as uuidv4 } from 'uuid';

const HTML_TEMPLATE_PATH = path.join(__dirname, "../views/templates/TemplateCarListing.html");
const API_URL = "http://127.0.0.1:8000";
const PUBLIC_PDF_URL = `${API_URL}/pdf/`;

@Route("listings")
export class ControllerListings {
	@Post("add")
	public async AddListing(
		@Body() request_body: RequestSendListing
	): Promise<ResponseSendListing> {
		let is_success = false;
		let list_id = 0;

		let session_token = request_body.session_token;
		let session = await GetSessionByToken(session_token);

		if (session.is_valid) {
			let make = request_body.make;
			let year = request_body.year;
			let mileage = request_body.mileage;
			let description = request_body.description;
			let price = request_body.price;

			let listing = {
				list_id: 0,
				make: make,
				year: year,
				mileage: mileage,
				description: description,
				price: price,
				created: new Date(),
				user_id: session.user_id,
				is_deleted: false,
			} as DbListing;

			list_id = await AddListing(listing);
			is_success = true;
		}

		let response = {
			is_success: is_success,
			list_id: list_id
		} as ResponseSendListing;

		return response;
	}

	@Post("get")
	public async GetListing(
		@Body() request_body: RequestGetListing
	): Promise<ResponseGetListing> {
		let is_success = false;
		let form = {
			list_id: 0,
			make: "",
			year: 0,
			mileage: 0,
			description: "",
			price: 0,
			created: new Date(),
			user_id: 0,
			is_deleted: true,
		} as DbListing;

		let session_token = request_body.session_token;
		let session = await GetSessionByToken(session_token);

		if (session.is_valid) {
			let list_id = request_body.list_id;
			form = await GetListingById(list_id);
			is_success = true;
		}

		let response = {
			is_success: is_success,
			form: form
		} as ResponseGetListing;

		return response;
	}

	@Post("getpdf")
	public async GetListingPdf(
		@Body() request_body: RequestGetListingPdf
	): Promise<ResponseGetListingPdf> {
		let is_success = false;
		let url = "";

		let session_token = request_body.session_token;
		let session = await GetSessionByToken(session_token);

		if (session.is_valid) {
			let list_id = request_body.list_id;
			let form = await GetListingById(list_id);

			let formFiltered = {
				make: form.make,
				year: form.year,
				mileage: form.mileage,
				description: form.description,
				price: form.price,
			};

			const htmlRaw = fs.readFileSync(HTML_TEMPLATE_PATH);
			const html = htmlRaw.toString();

			let details: PdfTemplateEntry[] = Object.keys(formFiltered).map(key => ({
				label: key,
				value: formFiltered[key].toString()
			}));
			let filename = uuidv4() + ".pdf";

			await GeneratePdfUsingTemplate(html, details, filename);

			url = PUBLIC_PDF_URL + filename;
			is_success = true;
		}

		let response = {
			is_success: is_success,
			url: url
		} as ResponseGetListingPdf;

		return response;
	}
}
