export interface DbListing {
    list_id: number,
    make: string,
    year: number,
    mileage: number,
    description: string,
    price: number,
    created: Date,
    user_id: number,
    is_deleted: boolean
}
