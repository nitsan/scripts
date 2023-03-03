const writeXlsxFile = require('write-excel-file/node')

module.exports.writeExcel = async function writeExcel(data, filePath, columns) {
    await writeXlsxFile(data, {
        columns, // (optional) column widths, etc.
        filePath,
    })
}

