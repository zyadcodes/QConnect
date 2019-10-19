import surahs from '../Data/Surahs.json'
import pages from '../Data/mushaf-wbw.json'
export async function getPageText (pageNumber) {
    try {
        let response = await fetch(
            'https://salamquran.com/en/api/v6/page?index='+pageNumber,
        );
        let responseJson = await response.json();
        return responseJson.result;
    } catch (error) {
        console.error(error);
    }
}

var dbgString = "";

function getSurahName(info){
   //if the line has surah index, let's get the name from surah index
    if(!isNaN(info.sura)){
        return surahs[info.sura].name;
    }
    else if(info.line_type === "start_sura"){
        return info.name;
    }
    return "";
}

function getPageByLines(pageJson){
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
                text: lineData.word? lineData.word.map((word) => {return {id: word.id, char_type: word.char_type, text: word.text, aya: word.aya, sura: word.sura, audio: word.audio}}) : undefined
            }
        );
    });
    return lines;
}
export async function getPageTextWbW (pageNumber) {
    try {
        let response = await fetch(
            'https://salamquran.com/en/api/v6/page/wbw?index='+pageNumber
        );
        let responseJson = await response.json();
        let pageText = getPageByLines(responseJson.result);
        return pageText;
    } catch (error) {
        console.error(error);
    }
}