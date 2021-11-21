import {dirname} from "path";
import {fileURLToPath} from "url";
import IndividualData from "./classes/IndividualData.js";
import JuridicalData from "./classes/JuridicalData.js";
import PhysicalData from "./classes/PhysicalData.js";

export function randomFilename() {
	return Math.random().toString().split(".")[1].padEnd("0");
}

export function castObjectToClass(obj) {
	return Object.assign([new PhysicalData(), new IndividualData(), new JuridicalData()][obj.type], obj);
}

export const rootDir = dirname(fileURLToPath(import.meta.url));
