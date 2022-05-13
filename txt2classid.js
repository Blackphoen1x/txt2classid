const xlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

function finish() {
    console.log("按任意键退出...");
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', () => {
        process.exit(0);
    })
}

function txt2classid() {
    return new Promise((resolve, reject) => {
        const lines = ["var NTIPAliasClassID = {};"];
        const handleList = ["weapons", "armor", "misc"];
        const __dirname = path.resolve();

        let classid = 0;

        handleList.forEach(fileName => {
            // 1.读取
            let modRows;
            let originalRows;
            try {
                modRows = xlsx.parse(path.join(__dirname, `txt_mod/${fileName}.txt`))[0].data;
            } catch (e) {
                console.log(`读取txt文件失败：txt_mod/${fileName}.txt`);
                reject();
            }

            try {
                originalRows = xlsx.parse(path.join(__dirname, `txt_original/${fileName}.txt`))[0].data;
            } catch (e) {
                console.log(`读取txt文件失败：txt_original/${fileName}.txt`);
                reject();
            }

            // 2.处理
            const tableHeadRow = modRows.shift();
            const originalTableHeadRow = originalRows.shift();
            const nameIndex = tableHeadRow.includes('*name') ? tableHeadRow.indexOf('*name') : tableHeadRow.indexOf('name');
            const codeIndex = tableHeadRow.indexOf('code');
            const originalNameIndex = originalTableHeadRow.includes('*name') ? originalTableHeadRow.indexOf('*name') : originalTableHeadRow.indexOf('name');
            const originalCodeIndex = originalTableHeadRow.indexOf('code');

            if (nameIndex === -1 || codeIndex === -1) {
                console.log("找不到表头中name或code所在列");
                reject();
            }
            modRows.forEach(row => {
                if (row[0] === "Expansion") {
                    return;
                }
                const itemCode = row[codeIndex];
                const itemInOriginal = originalRows.find(row => row[originalCodeIndex] === itemCode);
                let itemName = !!itemInOriginal ? itemInOriginal[originalNameIndex] : row[nameIndex];
                itemName = !!itemName ? itemName.replace(/\s+/g, "").toLowerCase() : "";
                const line = itemName ?
                    `NTIPAliasClassID["${itemCode}"] = ${classid}; NTIPAliasClassID["${itemName}"] = ${classid};` :
                    `NTIPAliasClassID["${itemCode}"] = ${classid}`;
                lines.push(line);
                classid++;
            })
        })

        // 输出到文件
        const string = lines.join("\n");
        const outputFile = path.join(__dirname, `output/NTItemAlias.dbl`);
        try {
            fs.writeFileSync(outputFile, string);
        } catch (e) {
            console.log("读取txt文件失败");
            reject();
        }

        console.log(`生成文件成功，路径为：${outputFile}`);
        resolve();
    });
}

txt2classid()
    .then(() => {
        finish();
    })
    .catch(() => {
        finish();
    });
