const readXlsxFile = require('read-excel-file/node')
const { writeExcel } = require('./write-excel');

let maxPhones = 1;

function cleanValue(value) {
    return value.replace(/\D/g, '');
}

function buildRow(rowData) {
    const row = [];

    rowData.forEach(cell => {
        if (cell) {
            if (cell.includes(';')) {
                const phones = cell.split(';');
                phones.forEach(phone => {
                    const cleanPhone = cleanValue(phone);
                    if (cleanPhone.startsWith('05')) {
                        row.push({
                            type: String,
                            value: cleanPhone
                        });
                    }
                });
            } else {
                row.push({
                    type: String,
                    value: cell.includes('05') ? cleanValue(cell) : cell
                });
            }
        }

    });
    if (maxPhones < row.length) {
        maxPhones = row.length;
    }

    return row;
}

async function readExcel(path) {
    const data = [];
    return readXlsxFile(path).then((rows) => {
        console.log('number of lines:', rows.length);
        rows.forEach(row => {
            data.push(buildRow(row))
        })
        return data;
    })
}

function addHeader(data) {
    const phonesHeader = [];
    for (let i = 1; i < maxPhones; i++) {
        phonesHeader.push({
            value: `Phone #${i}`,
            fontWeight: 'bold'
        })
    }
    return [
        [
            {
                value: 'Name',
                fontWeight: 'bold'
            },
            ...phonesHeader
        ],
        ...data
    ]
}

async function start(path, exportPath) {
    console.log('Reading excel from: ', path);
    let cleanData = await readExcel(path);
    cleanData = addHeader(cleanData);
    console.log('Writing excel to: ', exportPath);
    await writeExcel(cleanData, exportPath,);
}

start('/Users/nitsanzohar/Documents/anat.xlsx', '/Users/nitsanzohar/Documents/anat-new.xlsx');