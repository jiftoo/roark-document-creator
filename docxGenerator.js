import fs from "fs";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import expressions from "angular-expressions";
import {randomFilename} from "./util.js";

expressions.filters.lower = function (input) {
	if (!input) return input;
	return input.toLowerCase();
};
function angularParser(tag) {
	tag = tag.replace(/^\.$/, "this").replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"');
	const expr = expressions.compile(tag);
	return {
		get: function (scope, context) {
			let obj = {};
			const scopeList = context.scopeList;
			const num = context.num;
			for (let i = 0, len = num + 1; i < len; i++) {
				obj = Object.assign(obj, scopeList[i]);
			}
			return expr(scope, obj);
		},
	};
}

const schemaPath = "./schema/docx/schema.docx";
const tempDir = "./temp/docx";
let templater = null;

export async function prepareDocxGenerator() {
	if (fs.existsSync(schemaPath)) {
		const zip = new PizZip(fs.readFileSync(schemaPath, "binary"));
		templater = new Docxtemplater(zip, {parser: angularParser});
	} else {
		throw Error("docx template doesn't exist");
	}
}

export async function generateDocx(object) {
	const applyNameChange = (side) => {
		if (side.changes) {
			side.name = side.changes.name ?? side.name;
			side.surname = side.changes.surname ?? side.surname;
			side.paternal = side.changes.paternal ?? side.paternal;
		}
	};

	applyNameChange(object.plaintiff);
	applyNameChange(object.defendant);

	console.log(object.plaintiff);
    
	await prepareDocxGenerator();
	templater.render(object);

	const buffer = templater.getZip().generate({type: "nodebuffer"});

	const filename = randomFilename() + ".docx";
	await fs.promises.writeFile(tempDir + "/" + filename, buffer);

	console.log(tempDir + "/" + filename);
	return filename;
}
