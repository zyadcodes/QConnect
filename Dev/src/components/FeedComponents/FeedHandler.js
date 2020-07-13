//NOTE this handler is incomplete
//it's only use currently is for the badge
export default class FeedHandler {
  static shouldntShowBadge = true;
  
  static whenKeyboardShows;
  static whenKeyboardHides;

  static doThisWhenKeyboardShows(func) {
    FeedHandler.whenKeyboardShows = func;
  }
  static doThisWhenKeyboardHides(func) {
    FeedHandler.whenKeyboardHides = func;
  }
}
