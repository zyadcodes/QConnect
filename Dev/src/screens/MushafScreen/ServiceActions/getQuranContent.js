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

function getPageByLines(pageJson){
    var lines = [];
    pageJson.map((lineData) => {
        lines.push(
            {
                line: lineData.detail.line,
                surah: lineData.detail.sura,
                ayah: lineData.detail.aya,
                text: lineData.word.map((word) => {return {id: word.id, char_type: word.char_type, text: word.text, aya: word.aya, sura: word.sura, audio: word.audio}})
            }
        );
    });
    return lines;
}
export async function getPageTextWbW (pageNumber) {
    try {
        let response = await fetch(
            'https://salamquran.com/en/api/v6/page/wbw?index=200'
        );
        let responseJson = await response.json();
        pageText = getPageByLines(responseJson.result);
        return pageText;
    } catch (error) {
        console.error(error);
    }
}