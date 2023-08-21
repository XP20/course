import uuid from "react-native-uuid";
import axios from "axios";
import RNFS from "react-native-fs";
import { DocumentPickerResponse } from "react-native-document-picker";
import { RequestSendAttachment } from "../../../backend/src/models/messages/RequestSendAttachment";
import { ResponseSendAttachment } from "../../../backend/src/models/messages/ResponseSendAttachment";
import { DbAttachment } from "../../../backend/src/models/db/DbAttachment";

const API_URL = "http://127.0.0.1:8000";
const ATTACHMENTS_UPLOAD_URL = `${API_URL}/attachments/upload`;
const ATTACHMENTS_DOWNLOAD_URL = `${API_URL}/attachments`;

const AXIOS_FORMDATA_CONFIG = {
	headers: {
		"Content-Type": "multipart/form-data",
		"responseType": "json",
	},
};

export async function SendAttachments(
	selectedAttachments: DocumentPickerResponse[],
	session_token: string,
) {
	try {
		for (let attachment of selectedAttachments) {
			await SendAttachment(attachment, session_token);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function SendAttachment(attachment: DocumentPickerResponse, session_token: string) {
	try {
		let attachment_uuid = uuid.v4();
		let request = {
			session_token,
			attachment: {
				uuid: attachment_uuid,
				note: "not_implemented",
				created: new Date(),
				is_deleted: false,
			} as DbAttachment,
		} as RequestSendAttachment;

		// Uploading file
		const formData = new FormData();
		formData.append("request_json", JSON.stringify(request));
		// @ts-ignore
		formData.append("attachment_file", attachment);

		let query = await axios.post(ATTACHMENTS_UPLOAD_URL, formData, AXIOS_FORMDATA_CONFIG);
		let response = query.data as ResponseSendAttachment;

		if (!response.is_success) {
			console.error("Query unsuccessful!");
		}

		// Downloading file
		let originalName = attachment.name;
		let fileExt = originalName.split(".").pop();
		let filename = `${attachment_uuid}.${fileExt}`;
		await ReceiveAttachment(filename);
	} catch (err) {
		console.error(err);
	}
}

export async function ReceiveAttachment(filename: string) {
	try {
		let localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
		let { jobId, promise } = RNFS.downloadFile({
			fromUrl: `${ATTACHMENTS_DOWNLOAD_URL}/${filename}`,
			toFile: localFilePath,
		});
		await promise;
	} catch (err) {
		console.error(err);
	}
}
