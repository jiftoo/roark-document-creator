import {generateDocx} from "./docxGenerator.js";
import {generatePdf} from "./pdfGenerator.js";
import {castObjectToClass} from "./util.js";

export async function servePdf(req, resp) {
	const t1 = process.hrtime.bigint();

	const filename = await generatePdf({plaintiff: castObjectToClass(req.body.zaimodavec), defendant: castObjectToClass(req.body.zaemshik)});
	resp.send("file/" + filename);

	const t2 = process.hrtime.bigint();
	console.info("Generated in", ((t2 - t1) / BigInt(1e6)).toString(), "ms");
}

export async function serveDocx(req, resp) {
	const t1 = process.hrtime.bigint();

	const filename = await generateDocx({plaintiff: castObjectToClass(req.body.zaimodavec), defendant: castObjectToClass(req.body.zaemshik)});
	resp.send("file/" + filename);

	const t2 = process.hrtime.bigint();
	console.info("Generated in", ((t2 - t1) / BigInt(1e6)).toString(), "ms");
}
