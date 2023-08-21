import { DbAttachment } from "../db/DbAttachment";

export interface RequestSendAttachment {
	/**
	 * Attachments
	 */
	session_token: string;
	attachment: DbAttachment;
}

/*
{
    "session_token": "something",
    "attachment": {
        "uuid": "206921ab-f344-4728-ab48-33475585933d",
        "note": "note text",
        "created": 1671703880,
        "is_deleted": false
    }
}
 */
