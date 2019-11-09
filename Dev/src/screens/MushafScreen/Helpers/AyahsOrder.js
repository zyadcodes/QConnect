// compare which ayah comes first: ayah1 or ayah2
// return: 0 if they are the same ayah
//         1 if ayah1 is before ayah2
//         -1 if ayah2 is before ayah1
export function compareOrder(ayah1, ayah2) {

    if (ayah1.page === ayah2.page &&
        ayah1.ayah === ayah2.ayah &&
        ayah1.surah === ayah2.surah) {
        return 0; //
    }
    // ayah 1 is before ayah 2 if:
    else if (ayah1.page < ayah2.page || // ayah1 page is before ayah 2 page
        (ayah1.page === ayah2.page && ( // OR: ayah1 and ayah2 on the same page yet:
            ayah1.surah < ayah2.surah || // ayah1's surah is before ayah 2's surah
            (ayah1.surah === ayah2.surah && // OR: ayah1 and ayah2 are on the same surah yet 
                ayah1.ayah < ayah2.ayah) // ayah1's number is less than ayah2.
        )
        )) {
        return 1;
    }

    //if not the same ayahs, and not ayah 1 before ayah 2, then ayah 2 is before ayah 1.
    return -1;
}

export function isAyahSelected(ayah, selectionStarted, selectionCompleted, selectedAyahsStart, selectedAyahsEnd) {
    return (
        (selectionStarted || selectionCompleted) && // there are ayahs selected by the user
        compareOrder(selectedAyahsStart, ayah) >= 0 && //if ayah is after selection start
        compareOrder(selectedAyahsEnd, ayah) <= 0 //and ayah before selection end
    );
}