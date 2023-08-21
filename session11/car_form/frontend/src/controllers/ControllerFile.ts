import RNFetchBlob from "rn-fetch-blob";
import { Platform } from "react-native";

const PDF_MIMETYPE = "application/pdf";

const RN_FETCH_BLOB_CONFIG = {
	fileCache: true,
};

export async function DownloadAndOpenFile(url: string, mimetype = PDF_MIMETYPE) {
	try {
		await RNFetchBlob.config(RN_FETCH_BLOB_CONFIG)
			.fetch("GET", url)
			.then((res) => {
				if (Platform.OS === "android") {
					RNFetchBlob.android.actionViewIntent(res.path(), mimetype);
				}

				if (Platform.OS === "ios") {
					RNFetchBlob.ios.previewDocument(res.path());
				}
			});
	} catch (err) {
		console.error(err);
	}
}
