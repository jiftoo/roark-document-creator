import AdmZip from "adm-zip";
import expressions from "angular-expressions";
import {exec, execSync} from "child_process";
import commandExists from "command-exists";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import PizZip from "pizzip";
import {generatePdf} from "./pdfGenerator.js";
import {rootDir} from "./util.js";

// expressions.filters.lower = function (input) {
// 	if (!input) return input;
// 	return input.toLowerCase();
// };
// function angularParser(tag) {
// 	tag = tag.replace(/^\.$/, "this").replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"');
// 	const expr = expressions.compile(tag);
// 	return {
// 		get: function (scope, context) {
// 			let obj = {};
// 			const scopeList = context.scopeList;
// 			const num = context.num;
// 			for (let i = 0, len = num + 1; i < len; i++) {
// 				obj = Object.assign(obj, scopeList[i]);
// 			}
// 			return expr(scope, obj);
// 		},
// 	};
// }

const schemaPath = "./schema/docx/schema.docx";
const tempDir = "./temp/docx";
const tempDirPdf = "./temp/pdf";
let templater = null;

export async function prepareDocxGenerator() {
	// if (fs.existsSync(schemaPath)) {
	// 	const zip = new PizZip(fs.readFileSync(schemaPath, "binary"));
	// 	templater = new Docxtemplater(zip, {parser: angularParser});
	// } else {
	// 	throw Error("docx template doesn't exist");
	// }
}

export async function generateDocx(object) {
	// const applyNameChange = (side) => {
	// 	if (side.changes) {
	// 		side.name = side.changes.name ?? side.name;
	// 		side.surname = side.changes.surname ?? side.surname;
	// 		side.paternal = side.changes.paternal ?? side.paternal;
	// 	}
	// };

	// applyNameChange(object.plaintiff);
	// applyNameChange(object.defendant);

	// console.log(object.plaintiff);

	// await prepareDocxGenerator();
	// templater.render(object);

	// const buffer = templater.getZip().generate({type: "nodebuffer"});

	// const filename = randomFilename() + ".docx";
	// await fs.promises.writeFile(tempDir + "/" + filename, buffer);

	// console.log(tempDir + "/" + filename);
	// return filename;

	const filename = await generatePdf(object);
	if (commandExists.sync("soffice")) {
		// update rootDir when moving docxGenerator
		const command = `soffice --invisible --infilter="writer_pdf_import" --convert-to docx:"MS Word 2007 XML" --outdir ${tempDir} ${tempDirPdf}/${filename}`;
		try {
			const out = execSync(command, {cwd: rootDir}).toString().split("\n");
			const hasError = out.some((str) => str.toLowerCase().startsWith("error"));
			if (hasError) {
				console.log("Error", out);
				return filename;
			} else {
				// Success
				const docxFile = filename.replace("pdf", "docx");
				const docxPath = `${tempDir}/${docxFile}`;

				const docxZip = new AdmZip(docxPath);
				const newZip = new AdmZip();

				docxZip.getEntries().forEach((entry) => {
					if (!entry.isDirectory) {
						let data = entry.getData();
						if (entry.entryName === "word/document.xml") {
							data = data.toString().replace(/<w:pict>.+?<\/w:pict>/ms, "");
						}
						newZip.addFile(entry.entryName, data);
					}
				});

				newZip.writeZip(docxPath);

				return filename.replace("pdf", "docx");
			}
		} catch (error) {
			console.log("Exception", error);
			return filename;
		}
	} else {
		console.log("No soffice");
		return filename;
	}
}
