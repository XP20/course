import fs from "fs";
import {PdfTemplateEntry} from "../models/interfaces/PdfTemplateEntry";
import * as pdf from "pdf-creator-node";
import path from "path";

const PDF_OUTPUT_PATH = path.join(__dirname, "../../public/pdf/");

const PDF_OPTIONS = {
    format: "A5",
    orientation: "portrait",
    border: "1cm",
};

export async function GeneratePdfUsingTemplate(html: string, details: PdfTemplateEntry[], filename: string) {
    const save_path = PDF_OUTPUT_PATH + filename;
    let document = {
        html: html,
        data: {
            details: details,
        },
        path: save_path,
        type: "",
    };

    try {
        await pdf.create(document, PDF_OPTIONS)
    } catch (err) {
        console.error(err);
    }
}
