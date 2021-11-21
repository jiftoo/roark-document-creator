import cors from "cors";
import express from "express";
import fs from "fs";
import {prepareDocxGenerator} from "./docxGenerator.js";
import {preparePdfGenerator} from "./pdfGenerator.js";
import {serveDocx, servePdf} from "./routes.js";

export const obj = {
	type: 2,
	name: 'ООО "ЯНДЕКС"',
	phone: null,
	email: null,
	address: {
		type: null,
		value: "г Москва, ул Льва Толстого, д 16",
		realestate: null,
		kladr: null,
		oktmo: null,
		inn: null,
	},
	representative: {
		name: null,
		surname: null,
		paternal: null,
		address: null,
		phone: null,
		POADate: null,
		POANumber: null,
	},
	defendant: {
		birthDate: null,
		birthPlace: null,
		workPlace: null,
		passport: {
			series: null,
			number: null,
			issuer: null,
			issueDate: null,
		},
		driverLicense: {
			series: null,
			number: null,
		},
		vehicleRegistration: {
			series: null,
			number: null,
			issuer: null,
			issueDate: null,
		},
		noData: false,
	},
	inn: "7736207543",
	kladr: "7700000000070950031",
	okato: "45286590000",
	oktmo: "45383000",
	autofillAddress: true,
	filial: {
		name: null,
	},
};

(async function () {
	await prepareDocxGenerator();
	await preparePdfGenerator();

	const app = express();
	app.use(cors());
	app.use(express.json());

	app.post("/pdf", servePdf);
	app.post("/docx", serveDocx);
	app.get("/file/:filename", (req, resp) => {
		if (req.method !== "GET") {
            resp.sendStatus(200)
			return;
		}

		const [name, format] = req.params.filename.split(".");
		const path = `./temp/${format}/${name}.${format}`;
		resp.download(path, (err) => {
			const filename = name + "." + format;
			if (err) {
				resp.status(404);
				if (err.code === "ENOENT") {
					resp.send("No such file: " + filename);
				}
				console.error("No file  ", filename);
			} else {
				console.error("Sent file", filename);
			}
			if (req.method === "GET") {
				fs.unlink(path, () => {});
			}
		});
	});
	app.listen("3000");
})();
