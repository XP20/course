import { Body, Controller, Post, Get, Route, FormField, Query, UploadedFile } from "tsoa";
import { ResponseSendAttachment } from "../models/messages/ResponseSendAttachment";
import { RequestSendAttachment } from "../models/messages/RequestSendAttachment";
import * as fs from "fs";
import path from "path";
import {DbAttachment} from "../models/db/DbAttachment";
import {AddAttachment, GetSessionByToken} from "../services/ServiceDatabase";

@Route("attachments")
export class ControllerAttachments {
	@Post("upload")
	public async Upload(
		@FormField() request_json: string,
		@UploadedFile() attachment_file
	): Promise<ResponseSendAttachment> {
		let request = JSON.parse(request_json) as RequestSendAttachment;

		let is_success = false;

		let session_token = request.session_token;
		let session = await GetSessionByToken(session_token);
		if (session.is_valid) {
			let original_name: string = attachment_file.originalname;
			let file_ext: string = '.' + original_name.split('.').pop();
			let filename = request.attachment.uuid + file_ext;

			if (await AddAttachment(request.attachment)) {
				const file_name_on_server = path.join(__dirname, "../../public/attachments", filename);
				if (!fs.existsSync(file_name_on_server)) {
					fs.writeFileSync(file_name_on_server, attachment_file.buffer);
					is_success = true;
				}
			}

		}

		let response = {
			is_success: is_success,
		} as ResponseSendAttachment;
		return response;
	}
}
