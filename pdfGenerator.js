import {compile} from "angular-expressions";
import puppeteer from "puppeteer";
import {randomFilename, rootDir} from "./util.js";
import fs from "fs";

const schemaPath = rootDir + "/schema/pdf/schema.html";
const tempDir = "./temp/pdf";
const tabCount = 1;

let browser = null;
let templatePage = null;

export async function preparePdfGenerator() {
	browser = await puppeteer.launch({headless: true});
	console.time("openpages");
	await Promise.all(
		Array(tabCount)
			.fill(1)
			.map(() => browser.newPage())
	);
	templatePage = (await browser.pages())[0];
	await templatePage.setViewport({
		width: 700,
		height: 990,
	});
	templatePage.pdf();
	templatePage.goto(`file://${rootDir}/schema/pdf/index.html`);
	console.timeEnd("openpages");
}

export async function generatePdf(object) {
	// let schemaHtml = fs.readFileSync(schemaPath).toString();
	// const vars = [];
	// schemaHtml = schemaHtml.replaceAll(/\{[a-zA-Z.]+\}/g, (path) => {
	// 	const pattern = compile(path.replaceAll(/\{|\}/g, ""));
	// 	const value = pattern(object);
	// 	vars.push([path, value]);

	// 	return value;
	// });
	// await templatePage.setContent(schemaHtml);
	// await templatePage.addStyleTag({path: "schema/pdf/style.css"});
	// await templatePage.evaluate((vars) => {
	// 	document.querySelectorAll("*[data-show]").forEach((el) => {
	// 		const condition = el.dataset.show.split(" ");
	// 		if (condition.length > 1) {
	// 			const [marker, path] = condition;
	// 			if (marker === "any") {
	// 			}
	// 		} else {
	// 			const [path] = condition;
	// 		}
	// 	});
	// }, vars);

	await templatePage.evaluate((object) => {
		window.setData(object);
	}, object);

	const filename = randomFilename() + ".pdf";
	await templatePage.pdf({path: `${tempDir}/${filename}`, format: "A4", preferCSSPageSize: true, landscape: false, printBackground: true});
	return filename;
}
