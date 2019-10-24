//Screen which will provide all of the possible settings for the user to click on
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import colors from 'config/colors';
import QcParentScreen from "screens/QcParentScreen";
import SelectionPage from './Components/SelectionPage';
import Swiper from 'react-native-swiper'
import { Icon } from 'react-native-elements';


export default class MushafScreen extends QcParentScreen {

    state = {
        pages: ["604", "603", "602"],
        key: 1,
        index: 1
    }

    renderItem(item, idx) {
        const itemInt = parseInt(item)
        return (
            <View style={styles.container} key={idx}>
                <SelectionPage page={itemInt} onChangePage={this.onChangePage.bind(this)} />
            </View>
        )
    }

    onChangePage(pageNumber) {
        let nextPage = parseInt(pageNumber) + 1;
        let curPage = parseInt(pageNumber);
        let prevPage = parseInt(pageNumber) - 1;
        let index = 1;

        //if we are in the first page, change render page 1, 2, and 3, and set current page to index 0 (page 1)
        //this way, users can't swipe left to previous page since there is no previous page
        if (pageNumber === 1) {
            //bug bug: there is a bug in swiper where if I set index to 0 (to indicate end of book), 
            // onIndexChanged is not called on the next swipe.
            // this is a temporary workaround until swiper bug is fixed or we find a better workaround.
            prevPage = pageNumber;
            curPage =  pageNumber; 
            nextPage = pageNumber + 1;
            index= 1;
        }
        //if we are in the last page, change render page 602, 603, and 604, and set current page to index 2 (page 604)
        //this way, users can't swipe right to next page, since there is no next page
        else if (pageNumber === 604) {
            //bug bug: there is a bug in swiper where if I set index to 0 (to indicate end of book), 
            // onIndexChanged is not called on the next swipe.
            // this is a temporary workaround until swiper bug is fixed or we find a better workaround.
            prevPage = pageNumber - 1;
            curPage =  pageNumber; 
            nextPage = pageNumber;
            index= 1;
        } 

        //otherwise, set the current page to the middle screen (index = 1), and set previous and next screens to prev and next pages 
        this.setState({
            pages: [nextPage.toString(), curPage.toString(), prevPage.toString()],
            index: index
        }
        )
    }

    onPageChanged(idx) {
        //if swipe right, go to next page, unless we are in the last page.
        if (idx === this.state.index - 1 && parseInt(this.state.pages[0]) !== 604) {
            const newPages = this.state.pages.map(i => (parseInt(i) + 1).toString())
            this.setState({ pages: newPages, key: ((this.state.key + 1) % 2), index: 1 })
        }
        //if swipe right, go to previous page, unless we are in the first page
        else if (idx  === this.state.index + 1  && parseInt(this.state.pages[2]) !== 1) {
            const newPages = this.state.pages.map(i => (parseInt(i) - 1).toString())
            this.setState({ pages: newPages, key: ((this.state.key + 1) % 2), index: 1 })
        }
    }

    render() {
        return (
            <Swiper
                index={this.state.index}
                key={this.state.key}
                style={styles.wrapper}
                prevButton={<Icon
                    color= {colors.primaryDark}
                    size={35}
                    name={'angle-left'}
                    type="font-awesome" />}
                nextButton={<Icon
                    color= {colors.primaryDark}
                    size={35}
                    name={'angle-right'}
                    type="font-awesome" />}
                loop={false}
                showsButtons={true}
                showsPagination={false}
                onIndexChanged={(index) => this.onPageChanged(index)}>
                {this.state.pages.map((item, idx) => this.renderItem(item, idx))}
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    ayahText: {
        padding: 5,
        textAlign: 'right',
        fontFamily: 'me_quran',
        fontSize: 30,
        color: colors.darkGrey
    }
})