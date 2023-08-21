import {DbListing} from "../db/DbListing";

export interface ResponseGetListing {
    is_success: boolean,
    form: DbListing
}
