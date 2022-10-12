const xlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { NTIPAliasClassID } = require('./NTItemAlias.dbl');

const lines = ["var NTIPAliasClassID = {};"];
const handleList = ["misc"];
const __dirname1 = path.resolve();

let strings = [];
strings = strings.concat(["1"]).concat(["2"]);
console.log(strings);