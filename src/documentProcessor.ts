import fs from 'fs';
import path from 'path';
import PdfParse from 'pdf-parse';

const DEFAULT_DIRECTORY = './documents';

interface ProcessedDocument {
    document: string;
    content?: string;
}

async function documentProcessor(): Promise<ProcessedDocument[]> {
    const documents: ProcessedDocument[] = [];

    const documentData = await documentReader('cpd60187.pdf')
    documents.push(documentData);

    return documents;
}

async function documentReader(file: string): Promise<ProcessedDocument> {
    const pdfPath = path.join(DEFAULT_DIRECTORY, file);

    const pdfBuffer = fs.readFileSync(pdfPath);

    let documentData: ProcessedDocument =  {
        document: file,
    }

    await new Promise((resolve, reject) => {
        PdfParse(pdfBuffer).then(function (data) {
            documentData.content = data.text;
            resolve(data)
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });

    return documentData;
}

export default documentProcessor;