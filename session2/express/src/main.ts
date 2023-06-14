import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ApiResponse} from "./interfaces/APIResponse";
import * as _ from "lodash";

const app: Application = express();
const mult = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(mult.array("data"));

let cacheFile = './cache.json';

let requestFail: ApiResponse = {
    success: false
};

function cacheIsThere() {
    if (!fs.existsSync(cacheFile)) {
        fs.writeFileSync(cacheFile, '{}');
    }
}

function getCachedEntry(species: string) {
    cacheIsThere();
    let cachedRaw = fs.readFileSync(cacheFile);
    let result: any = false;

    try {
        let cached = JSON.parse(cachedRaw.toString());
        let plant = cached[species];
        if (plant) {
            result = plant;
        }
    } catch (e) {
        console.log(e);
    }

    return result;
    //? Which worse:
    //?    2 return statements, 
    //?    using any type, 
    //?    using inline if statement for return
}

function addCachedEntry(species: string, response: ApiResponse) {
    cacheIsThere();
    let cachedRaw = fs.readFileSync(cacheFile);
    
    try {
        let cached = JSON.parse(cachedRaw.toString());
        cached[species] = response;
    
        fs.writeFileSync(cacheFile, JSON.stringify(cached), {flag:'w+'});
    } catch (e) {
        console.log(e);
    }
}

app.post('/calculate_stats', (req, res) => {
    let request = req.body;
    let species = request.species;
    let plantList = request.data;

    let response = requestFail;
    let samples = 0;

    if (species !== undefined && species.length > 0) {
        response.success = true;

        let matched = _.filter(plantList, { species: species });

        if (matched.length > 0) {    
            response.sepalLengthAvg = _.meanBy(matched, (o) => o.sepalLength).sepalLength;
            response.sepalWidthAvg = _.meanBy(matched, (o) => o.sepalWidth).sepalWidth;
            response.petalLengthAvg = _.meanBy(matched, (o) => o.petalLength).petalLength;
            response.petalWidthAvg = _.meanBy(matched, (o) => o.petalWidth).petalWidth;
    
            response.sepalLengthMin = _.minBy(matched, (o) => o.sepalLength).sepalLength;
            response.sepalWidthMin = _.minBy(matched, (o) => o.sepalWidth).sepalWidth;
            response.petalLengthMin = _.minBy(matched, (o) => o.petalLength).petalLength;
            response.petalWidthMin = _.minBy(matched, (o) => o.petalWidth).petalWidth;
    
            response.sepalLengthMax = _.maxBy(matched, (o) => o.sepalLength).sepalLength;
            response.sepalWidthMax = _.maxBy(matched, (o) => o.sepalWidth).sepalWidth;
            response.petalLengthMax = _.maxBy(matched, (o) => o.petalLength).petalLength;
            response.petalWidthMax = _.maxBy(matched, (o) => o.petalWidth).petalWidth;
        } else {
            response.success = false;
        }
    }

    if (response.success) {
        addCachedEntry(species, response);
    }

    res.json(response);
});

app.listen(
    8000,
    () => {
        // http://127.0.0.1:8000
        console.log('Server started http://localhost:8000');
    }
)