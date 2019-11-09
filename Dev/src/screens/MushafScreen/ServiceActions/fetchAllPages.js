'use strict';
var https = require('https');
var request = require('request');
var surahs = require('../Data/Surahs.json')
const fs = require('fs');
let AllLines = [];

//audio prefix url: https://dl.salamquran.com/ayat/afasy-murattal-192/

getAllPages();

async function getAllPages(){
    var i;
    for (i = 1; i <= 604; i++) {
        try{
        let lines = await getPageTextWbW(i);
        console.log("fetched page: " + i)
        if (lines && lines.length > 0) {
            AllLines.push(lines);
            if (i === 604) {
                fs.writeFileSync(
                    "/Users/elyasse/Documents/GitHub/ZQConnect/QConnect/Dev/src/screens/MushafScreen/ServiceActions/mushaf-wbw.js",
                    JSON.stringify(AllLines)
                );
            }
            }
        }
        catch(error) {
            console.log("failed to fetch: " + i + ". error: " + error)
    }
}
}




function getSurahName(info) {
    //if the line has surah index, let's get the name from surah index
    if (!isNaN(info.sura)) {
        return surahs[info.sura].name;
    }
    else if (info.line_type === "start_sura") {
        return info.name;
    }
    return "";

}

function getPageByLines(pageJson) {
    logInfo("inside gtPageByLines: page: " + pageJson);

    let lines = [];
    pageJson.map((lineData) => {
        lines.push(
            {
                line: lineData.detail.line,
                type: lineData.detail.line_type,
                surahNumber: lineData.detail.sura,
                surah: getSurahName(lineData.detail),
                index: lineData.detail.index,
                name: lineData.detail.name,
                ayah: lineData.detail.aya,
                text: lineData.word ? lineData.word.map((word) => { return { id: word.id, char_type: word.char_type, text: word.text, aya: word.aya, sura: word.sura, audio: word.audio } }) : undefined
            }
        );
    });
    return lines;
}

// wrap a request in an promise
function downloadPage(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
}

function logInfo(str) {
    fs.appendFileSync(
        "/Users/elyasse/Documents/GitHub/ZQConnect/QConnect/Dev/src/screens/MushafScreen/ServiceActions/mushaf-wbw.js",
        str
    );
}

async function getPageTextWbW(pageNumber) {
    var result = [];

    try {
        var url = 'https://salamquran.com/en/api/v6/page/wbw?index=' + pageNumber
        var result = await downloadPage(url);

        var jsonPage = JSON.parse(result);
        //logInfo(JSON.stringify(jsonPage.result));
        let pageText = getPageByLines(jsonPage.result);
        return pageText;
    } catch (error) {
        console.error(error);
    }

    //console.log("result: " + JSON.stringify(result));
    //console.log("returning: " + ret);
    return ret;

}