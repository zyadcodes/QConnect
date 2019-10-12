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

function getPageByLines2(pageJson){
    var lines = [];
    pageJson.map((lineData) => {
        //extract different ayahs within the same line
        // we want to bucket these separately to wrap them in the UI with a single view
        // so that they can all be highlighted with one tap etc..
        let lineAyahNums = [... new Set(lineData.word.map((word) => word.aya))]
        let lineAyahs = [];
        
        lineAyahNums.forEach((ayaNumber) => {
            lineAyahWords = lineData.word.filter((word) => word.aya === ayaNumber);
            lineAyahs.push(
                {
                    aya: ayaNumber,
                    text: lineAyahWords.map((word) => {return {
                        id: word.id, 
                        char_type: word.char_type, 
                        text: word.text, 
                        aya: word.aya, 
                        sura: word.sura, 
                        audio: word.audio}
                    })
                }
            )
        })

        lines.push(
            {
                line: lineData.detail.line,
                surah: lineData.detail.sura,
                ayas: lineAyahs
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
