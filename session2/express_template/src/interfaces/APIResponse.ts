export interface ApiResponse {
    success: boolean,

    sepalLengthAvg?: number,
    sepalWidthAvg?: number,
    petalLengthAvg?: number,
    petalWidthAvg?: number,

    sepalLengthMin?: number,
    sepalWidthMin?: number,
    petalLengthMin?: number,
    petalWidthMin?: number,

    sepalLengthMax?: number,
    sepalWidthMax?: number,
    petalLengthMax?: number,
    petalWidthMax?: number,
    
    payload?: number
}