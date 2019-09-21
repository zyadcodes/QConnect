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