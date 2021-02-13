using System;
using System.IO;
using System.Linq;
using NUnit.Framework;
using Xamarin.UITest;
using Xamarin.UITest.iOS;
using Xamarin.UITest.Queries;

namespace QConnectUITestsiOS
{
    [TestFixture]
    public class Tests
    {
        iOSApp app;

        [SetUp]
        public void BeforeEachTest()
        {
            // TODO: If the iOS app being tested is included in the solution then open
            // the Unit Tests window, right click Test Apps, select Add App Project
            // and select the app projects that should be tested.
            //
            // The iOS project should have the Xamarin.TestCloud.Agent NuGet package
            // installed. To start the Test Cloud Agent the following code should be
            // added to the FinishedLaunching method of the AppDelegate:
            //
            //    #if ENABLE_TEST_CLOUD
            //    Xamarin.Calabash.Start();
            //    #endif
            app = ConfigureApp
                .iOS
                // TODO: Update this path to point to your iOS app and uncomment the
                // code if the app is not included in the solution.
                //AFF83A7A-A063-4EF2-9371-91EC680DBF99
                .AppBundle ("/Users/elyasse/Library/Developer/Xcode/DerivedData/QuranConnect-aatvodfrdgdntqbujjjygvlvfbur/Build/Products/Calabash-iphonesimulator/QuranConnect.app")
                .DeviceIdentifier("AFF83A7A-A063-4EF2-9371-91EC680DBF99")
                .EnableLocalScreenshots()
                .StartApp();

            logOut();
        }

        private static readonly string validPhoneNumber = "+12064251111";
        private static readonly string validPwd = "testPwd";
        private static readonly string testPwd = "test@temp!Pw6";

        [Test]
        public void AppLaunches()
        {
            app.WaitForElement(x => x.Marked("LOGIN"));
            app.Screenshot("First screen.");
        }

        //------ Helper functions -------

        private void enterText(string target, string text)
        {
            app.EnterText(target, text);
            app.PressEnter();
        }

        private void enterUserNamePwd(string username, string pwd)
        {
            app.WaitForElement(x => x.Marked("Email"));
            enterText("Email", username);

            enterText("Password", pwd);

            AppResult[] results = app.Query(x => x.Raw("button {text CONTAINS 'Not now'}"));
            if (results.Any())
                app.Tap(allowButton => allowButton.Raw("button {text CONTAINS 'Not now'}"));

            app.Tap("LOGIN");
        }

        private void logOut()
        {
            bool loginScreen = false;
            try
            {
                app.WaitForElement(x => x.Marked("LOGIN"));
                loginScreen = true;
            }
            catch (Exception)
            {}

            if (loginScreen)
            {
                return;
            }

            //Test logging out
            app.DismissKeyboard();
            app.ScrollTo("TopBannerLeftButton");
            app.Tap(x => x.Marked("TopBannerLeftButton").Index(1));
            app.WaitForElement("QuranConnect");

            app.ScrollDownTo("QcDrawerItem_Settings");
            app.WaitForElement("QcDrawerItem_Settings");
            app.Tap("QcDrawerItem_Settings");
            app.WaitForElement("Log Out");
            app.Tap("Log Out");

            //verify that we are back on the login screen
            app.WaitForElement("LOGIN");
        }

        private static Random random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789-_";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private static string getRandomEmailAddress()
        {

            return "UTest_" + RandomString(10) + "@testing.ignore";
        }

        private static string getRandomName()
        {
            return "UTest_Name_" + RandomString(5);
        }

        private static string getRandomClassName()
        {
            return "UTest_Class_" + RandomString(5);
        }

        private static string getRandomManualStudentName()
        {
            return "UTest_Manual_Student_" + RandomString(3);
        }

        private void bootAndGoToWelcomeScreen(string userType)
        {
            app.WaitForElement(x => x.Marked("LOGIN"));

            // tap on create account
            app.Tap("Create Account");
            app.WaitForElement("I am a " + userType);
            app.Screenshot("Student vs teacher flow selection screen");

            //tap I am a student to get to student welcome screen
            app.Tap("I am a " + userType);
            app.WaitForElement("name");
            app.Screenshot(userType + "_welcomeScreen");
        }

        private void createAccount(string userType)
        {
            bootAndGoToWelcomeScreen(userType);

            //fill in the entries
            fillCreateAccountEntries(getRandomName(), validPhoneNumber, getRandomEmailAddress(), testPwd, testPwd);

            //------ change avatar tests ----------------
            // tap on one of the icons in the 2nd row
            app.Tap("avatar_image_2");
            app.Screenshot(userType + "_welcome_avatar_2_selected");
            //tap to launch the avatars pop out
            app.Tap("show_more_avatars");
            app.WaitForElement("avatar_grid_item_12");
            app.Tap("avatar_grid_item_12");
            app.Screenshot(userType + "_wlcm_selected_avatar_12");

            // ---- tap Create account and go to empty class screen------
            app.Tap("Get Started!");
        }

        private void fillCreateAccountEntries(string name, string phoneNumber, string email, string password, string confirmPassword)
        {
            enterText("name", name);
            enterText("phoneNumber", phoneNumber);
            enterText("emailAddress", email);
            enterText("password", password);
            enterText("confirmPassword", confirmPassword);
        }

        private string addManualStudent()
        {
            string studentName = getRandomManualStudentName();
            enterText("text_input_student_name", studentName);

            //tap to launch the avatars pop out
            app.Tap("show_more_avatars");
            app.WaitForElement("avatar_grid_item_8");
            app.Tap("avatar_grid_item_8");
            app.WaitForElement("avatar_row_touchable_8");
            app.WaitForElement("Add student");
            app.Tap("Add student");

            //validate that the student is added to the list
            app.WaitForElement("student_card_right_comp_" + studentName);

            //verify that the student text input field is now empty
            AppResult[] results = app.Query(x => x.Marked("text_input_student_name"));
            results[results.Length - 1].Text.Equals("");
            app.Screenshot("Manual student added");

            return studentName;
        }

        private void fillEvalCardNotes(string notes, string[] tags, bool popOutFlyout)
        {
            app.WaitForElement(x => x.Class("RCTUITextView"));

            //failed here
            enterText("eval_note Write a note", notes);

            //tap on Muduud evaluation tag on the card
            foreach (string tag in tags)
            {
                app.WaitForElement("eval_tag_" + tag);

                AppResult[] results = app.Query(x => x.Marked("eval_tag_" + tag));
                int componentIndex = popOutFlyout ? results.Length - 1 : 0;
                Tap("eval_tag_" + tag, componentIndex);
                
                //check if it becomes selected in the UI
                app.WaitForElement("eval_tag_" + tag + "_sel", "Timeout waiting for element: " + tag + "_sel", new TimeSpan(0, 2, 0));
            }

            //close eval note;
            if (popOutFlyout)
            {
                Tap("eval_callout_save");

                //new try.. may fail..
                if(app.Query(x => x.Marked("eval_callout_save")).Length > 0)
                {
                    app.Repl();
                }
            }

        }

        // ----- Test functions ----------
        [Test]
        public void TestLoginEmptyFields()
        {
            app.Tap("LOGIN");
            app.WaitForElement(x => x.Marked("OK"));
            app.Query(x => x.Marked("Please make sure all fields are filled out"));
            app.Screenshot("LoginEmptyUsrPwd");
            app.Tap("OK");
        }

        [Test]
        public void TestLoginEmptyPassword()
        {
            enterUserNamePwd("TestLoginEmptyPassword@bar.com", "");

            app.WaitForElement(x => x.Marked("OK"));
            app.Query(x => x.Marked("Please make sure all fields are filled out"));
            app.Screenshot("LoginEmptyPassword");
            app.Tap("OK");
        }

        [Test]
        public void TestLoginEmptyUsername()
        {
            enterUserNamePwd("", "TestLoginEmptyUsername");

            app.WaitForElement(x => x.Marked("OK"));
            app.Query(x => x.Marked("Please make sure all fields are filled out"));
            app.Screenshot("LoginEmptyUsername");
            app.Tap("OK");
        }

        [Test]
        public void TestLoginBadPassword()
        {
            enterUserNamePwd("TestLoginBadPassword@bar.com", "abc");

            app.WaitForElement(x => x.Marked("OK"));
            app.Query(x => x.Marked("Incorrect username or password"));

            app.Screenshot("LoginBadPassword");
            app.Tap("OK");
        }

        [Test]
        public void TestCreatingExistingUserStudent()
        {
            bootAndGoToWelcomeScreen("student");
            fillCreateAccountEntries(getRandomName(), validPhoneNumber, "student@hotmail.com", validPwd, validPwd);
            app.Tap("Get Started!");
            app.WaitForElement(x => x.Text("This email already exists"));
            app.Screenshot("email already exists _ student");
            app.Tap("OK");
        }

        [Test]
        public void TestCreatingExistingUserTeacher()
        {
            bootAndGoToWelcomeScreen("teacher");
            fillCreateAccountEntries(getRandomName(), validPhoneNumber, "student@hotmail.com", validPwd, validPwd);
            app.Tap("Get Started!");
            app.WaitForElement(x => x.Text("This email already exists"));
            app.Screenshot("email already exists _ teacher");
            app.Tap("OK");
        }

        [Test]
        public void TestWrongConfirmPasswordStudent()
        {
            bootAndGoToWelcomeScreen("student");
            fillCreateAccountEntries(getRandomName(), validPhoneNumber, getRandomEmailAddress(), validPwd, "abcdefgh");
            app.Tap("Get Started!");
            app.WaitForElement(x => x.Text("Please make sure your passwords match"));
            app.Screenshot("password mismatch _ student");
            app.Tap("OK");
        }

        [Test]
        public void TestWrongConfirmPasswordTeacher()
        {
            bootAndGoToWelcomeScreen("teacher");
            fillCreateAccountEntries(getRandomName(), validPhoneNumber, getRandomEmailAddress(), validPwd, "abcdefgh");
            app.Tap("Get Started!");
            app.WaitForElement(x => x.Text("Please make sure your passwords match"));
            app.Screenshot("password mismatch _ teacher");
            app.Tap("OK");
        }

        [Test]
        public void TestStudentCreateAccountWrongPhoneNumber()
        {
            bootAndGoToWelcomeScreen("student");
            fillCreateAccountEntries(getRandomName(), "234234", getRandomEmailAddress(), validPwd, validPwd);
            app.Tap("Get Started!");
            app.WaitForElement(x => x.Text("The phone number is invalid. Please enter a valid phone number."));
            app.Screenshot("invalid phone number _ student");
            app.Tap("OK");
        }

        [Test]
        public void TestTeacherCreateAccountWrongPhoneNumber()
        {
            bootAndGoToWelcomeScreen("teacher");
            fillCreateAccountEntries(getRandomName(), "234234", getRandomEmailAddress(), validPwd, validPwd);
            app.Tap("Get Started!");
            app.WaitForElement(x => x.Text("The phone number is invalid. Please enter a valid phone number."));
            app.Screenshot("invalid phone number _ teacher");
            app.Tap("OK");
        }

        [Test]
        public void TestStudentCreateAccountWrongEmailAddress()
        {
            bootAndGoToWelcomeScreen("student");
            fillCreateAccountEntries(getRandomName(), validPhoneNumber, "adfasdfl", validPwd, validPwd);
            app.Tap("Get Started!");
            app.WaitForElement(x => x.Text("Please enter a valid email address"));
            app.Screenshot("email already exists _ student");
            app.Tap("OK");
        }

        [Test]
        public void TestTeacherCreateAccountWrongEmailAddress()
        {
            bootAndGoToWelcomeScreen("teacher");
            fillCreateAccountEntries(getRandomName(), validPhoneNumber, "adfasdfl", validPwd, validPwd);
            app.Tap("Get Started!");
            app.WaitForElement(x => x.Text("Please enter a valid email address"));
            app.Screenshot("Please enter a valid email address _ teacher");
            app.Tap("OK");

        }

        [Test]
        public void TestStudentLoginLogoutSuccess()
        {
            enterUserNamePwd("student@hotmail.com", "password");

            //verify that we have al the different tabs loaded
            app.WaitForElement(x => x.Marked("Assignments"));
            app.Query(x => x.Marked("Assignments"));
            app.Query(x => x.Marked("Meet Online"));
            app.Query(x => x.Marked("Grades"));

            //test switching to a new class
            app.WaitForElement(x => x.Marked("DAILY PRACTICE LOG"));
            app.Tap("TopBannerLeftButton");
            app.Tap("CommonCore");

            //verify we switched effectively to the class
            app.WaitForElement("CommonCore");

            //test switching to grades tab
            app.Tap("Grades");
            app.WaitForElement("DAILY PRACTICE LOG");
            app.Screenshot("student main screen - CommonCore");
        }

        [Test]
        public void TestStudentNewAccountFlow()
        {
            createAccount("student");

            //verify we land on the join class screen
            app.WaitForElement("Join your class");
            app.Screenshot("Student no class FRE screen");
        }

        [Test]
        public void TestTeacherNewAccountFlow()
        {
            createAccount("teacher");

            //verify that we landed on add class screen
            app.WaitForElement("Click here to add a class");
            app.Screenshot("Teacher no class FRE screen");

            AppResult[] results = app.Query(x => x.Marked("Click here to add a class"));
            app.Tap(x => x.Marked("Click here to add a class").Index(results.Length - 1));

            enterText("textInput_addClass", getRandomClassName());
            app.Screenshot("teacher_create_account_flow_welcome");

            app.Tap("Edit class image");

            //select image id: 5
            app.WaitForElement("avatar_grid_item_5");
            app.Screenshot("teacher_create_account_flow_edit_class_image");

            app.Tap("avatar_grid_item_5");

            //ensure that the class avatar image has sifted to imageID: 5
            app.WaitForElement("class_avatar_5");

            results = app.Query(x => x.Marked("Add class"));
            app.Tap(x => x.Marked("Add class").Index(results.Length - 1));

            app.WaitForElement("classCodeValue");
            app.Screenshot("teacher_create_account_flow_add_class");

            //save class code to be used later by student to join class
            string newClassCode = app.Query(x => x.Marked("classCodeValue")).FirstOrDefault().Text;

            //tap on button to add students manually
            app.Tap("Add students manually");
            app.WaitForElement("Add student");

            string studentName = addManualStudent();

            // test removing the added student by tapping on the remove icon
            app.Tap("student_card_right_comp_" + studentName);
            app.WaitForElement(x => x.Text("Are you sure you want to remove this student?"));
            app.Tap("Remove");
            //verify that the student is removed
            app.WaitForNoElement(x => x.Text(studentName));

            //add a student back again
            studentName = addManualStudent();

            //press done button
            app.Tap("add_student_done_btn");


            app.WaitForElement("Assignments");
            app.Screenshot("teacher_create_account_flow_main");
            

            //attendance
        }

        [Test]
        public void TestAssignmentEvaluation()
        {
            string studentName = "UTest_Manual_Student_cn3";

            enterUserNamePwd("UTest_bmx136umq1@testing.ignore",testPwd);

            //AppResult[] results = app.Query(x => x.Marked("Assignments"));
            //app.Tap(x => x.Marked("Assignments").Index(3));

    
            //app.WaitForElement("surah_title_touchable");

            ////tap on surah ToC to change surah
            //app.WaitForElement("surah_title_touchable");
            //Tap("surah_title_touchable");
            //app.Screenshot("teacher_create_account_flow_surah_toc");

            ////type to filter surah
            //app.WaitForElement("qc_text_input");
            //app.EnterText("qc_text_input", "Yus");

            ////tap on the fitered surah name
            //app.WaitForElement("surahs_toc_item_Yusuf");
            //Tap("surahs_toc_item_Yusuf");
            //app.WaitForElement("surah_header_يوسف", "Timeout waiting for element", new TimeSpan(0, 1, 0));
            //app.Screenshot("teacher_create_account_flow_surah");

            ////change page
            //app.ScrollDown(b => b.Marked("page_wrapper_235"), ScrollStrategy.Gesture, swipePercentage: 0.67, swipeSpeed: 2000);
            //app.Tap("touchable_text_page_number_235_footer");
            //app.WaitForElement("text_input_mushaf_page_number");
            //app.ClearText("text_input_mushaf_page_number");
            //app.EnterText("text_input_mushaf_page_number", "111");

            //Tap("touchable_text_go");
            //Tap("touchable_text_go");
            ////app.WaitForNoElement("touchable_text_go");

            ////verify that page has been changed
            ////app.WaitForElement(x => x.Text("المائدة"));
            //app.ScrollDown(b => b.Marked("page_wrapper_111"), ScrollStrategy.Gesture, swipePercentage: 0.67, swipeSpeed: 2000);

            ////swipe pages left and right

            //app.SwipeLeftToRight();
            //app.ScrollDown(b => b.Marked("page_wrapper_112"), ScrollStrategy.Gesture, swipePercentage: 0.67, swipeSpeed: 2000);
            ////swipe right twice
            //app.SwipeRightToLeft();
            //app.SwipeRightToLeft();
            //app.ScrollDown(b => b.Marked("page_wrapper_110"), ScrollStrategy.Gesture, swipePercentage: 0.67, swipeSpeed: 2000);
            //app.ScrollUp(b => b.Marked("page_wrapper_110"), ScrollStrategy.Gesture, swipePercentage: 0.67, swipeSpeed: 2000);

            ////---- select ayah, verify selection assignment name

            ////if the ayah was already selectred from a previous test, let's clear selection
            //results = app.Query(x => x.Marked("mwt_15504_sel"));
            //if (results.Any()) {
            //    //tap on it to clear selection
            //    //todo: this is hacky, we should implement an etry point to explicitly clear selection
            //    Tap("mushaf_word_15504");
            //}

            //Tap("mushaf_word_15504");
            //app.WaitForElement(x => x.Marked("mwt_15504_sel"));
            string assignmentName = "Al-Ma'idah (14) p. 110";

            //app.Query(x => x.Marked("footer_label_" + assignmentName));

            ////select end ayah, verify selection assignment name,
            //Tap("mushaf_word_15554");
            //app.WaitForElement("footer_label_Al-Ma'idah (14 to 15) p. 110");

            ////change selection to one ayah again
            //Tap("mushaf_word_15504");
            //app.WaitForElement(x => x.Marked("mwt_15504_sel"));
            //app.Query(x => x.Marked("footer_label_" + assignmentName));
            //app.Screenshot("teacher_create_account_flow_assignment_mushaf");

            //save assignment, verify assignment name in student card
            //Tap("Save");

            app.WaitForElement("card_stud_" + studentName + "_assignment_" + assignmentName);
            Tap("card_stud_" + studentName + "_assignment_" + assignmentName);
            app.Screenshot("teacher_create_account_flow_main_assigment");

            app.WaitForElement("card_stud_" + studentName + "_assignment_" + assignmentName);
            Tap("card_stud_" + studentName + "_assignment_" + assignmentName);

            //edit assignment
            //save

            //grade assignment
            AppResult[] results = app.Query(x => x.Marked("ellipsis"));
            app.Tap(x => x.Marked("ellipsis").Index(results.Length - 1));
            app.WaitForElement("btn_evaluate_assignment");
            Tap("btn_evaluate_assignment");
            app.WaitForElement("btn_save_eval");

            //-- enter word level evaluation ----
            //tap on a word to enter some evaluation notes for it

            //For some reasons there are two instances of the word item, may be a bug that needs to
            // be investigated later. For now, to get around it, we query how many instances,
            // and tap on the last time since it would be the active one.
            Tap("mwt_15504_sel");
            fillEvalCardNotes("Pay attention to harakat", new string[] { "Muduud" }, true);

            //--- enter ayah level evaluation --
            //tap on end of ayah
            Tap("end_of_ayah_14");
            fillEvalCardNotes("ayah needs some more practice", new string[] { "Memorization", "Ekhfae" }, true);


            //tap on rating
            Tap("rating_view");
            Tap("btn_expand_notes");

            fillEvalCardNotes("overall recitation was fine. Practice some more the ayah.", new string[] { "Memorization", "Ekhfae", "Makharej" }, false);
            app.Screenshot("teacher_create_account_flow_evaluation");

            //save evaluation
            results = app.Query(x => x.Marked("btn_save_eval"));
            Tap("btn_save_eval");
            //verify profile screen: grade, label, history

            //app.ScrollTo("past_assignment_Al-Ma'idah (14) p. 110", "student_profile_container");
            app.ScrollDown(b => b.Marked("student_profile_container"), ScrollStrategy.Gesture, swipePercentage: 0.67, swipeSpeed: 2000);

            app.WaitForElement("past_assignment_" + assignmentName);
            app.Screenshot("teacher_create_account_flow_student_profile");

            Tap("past_assignment_" + assignmentName);
            //wait for old evaluation page to load
            app.WaitForElement("TopBannerMiddleTitle");
            app.WaitForElement(x => x.Marked("mwt_15504_sel"));
        }
           
        private void Tap(string label, int itemIndex)
        {
            app.Tap(c => c.Marked(label).Index(itemIndex));
        }

        private void Tap(string label)
        {
            AppResult[] results = app.Query(x => x.Marked(label));
            Tap(label, results.Length - 1); //tap the last instance

            //
            /*
             * Xamarin.UITest.Query.AppResult[] results = app.Query(x => x.Marked("mushaf_word_15504"));
                app.Tap(c => c.Marked("mushaf_word_15504").Index(results.Length - 1));
             */
        }
    }
}
