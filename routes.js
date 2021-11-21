import {generateDocx} from "./docxGenerator.js";
import {generatePdf} from "./pdfGenerator.js";
import {castObjectToClass} from "./util.js";

export async function servePdf(req, resp) {
	const filename = await generatePdf({plaintiff: castObjectToClass(req.body.zaimodavec), defendant: castObjectToClass(req.body.zaemshik)});
	resp.send("file/" + filename);
}

export async function serveDocx(req, resp) {
	const filename = await generateDocx({plaintiff: castObjectToClass(req.body.zaimodavec), defendant: castObjectToClass(req.body.zaemshik)});
	resp.send("file/" + filename);
}
