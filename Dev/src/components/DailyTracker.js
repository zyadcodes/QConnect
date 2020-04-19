import React, { useState, useEffect } from "react";
import {
  Calendar,
  ExpandableCalendar,
  CalendarProvider,
  WeekCalendar
} from "react-native-calendars";
import { View, TouchableOpacity } from 'react-native';
import colors from "config/colors";
import strings from "config/strings";
import { Icon } from 'react-native-elements';

const DailyTracker = props => {
  const [expanded, setExpanded] = useState(false);

  //determins whether the calendar will keep showing tapped days as marked, or just switch to the new tapped day
  const [trackingMode, setTrackingMode] = useState(
    props.trackingMode !== undefined ? props.trackingMode : true
  );

  //Today's date string in the format YYYY-MM-DD
  const getTodaysDateString = () => {
    var today = new Date();
    const todaysDate = `${today.getFullYear()}-${(
      '0' +
      (today.getMonth() + 1)
    ).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
  };

  const [currentDate, setCurrentDate] = useState(
    props.selectedDate ? props.selectedDate : getTodaysDateString()
  );

  // Takes practice tracking log and add properties to show on the calendar component
  const initializeDatesFromProps = () => {
    let dates = {};
    if (props.data) {
      Object.entries(props.data).map(entry => {
        //entry: first element is they key, 2nd is the value
        dates = {
          ...dates,
          [entry[0]]: {
            ...entry[1],
            marked: true,
            selected: true,
            selectedColor: colors.green,
          }
        };
      });
    }
    return dates;
  };
  let dates = initializeDatesFromProps();
  const [markedDates, setMarkedDates] = useState(dates);

  // UI theme (colors etc.) of the calendar
  const getTheme = () => {
    const disabledColor = colors.grey;
    return {
      // arrows
      arrowColor: colors.primaryDark,
      arrowStyle: { padding: 0 },
      selectedDayBackgroundColor: colors.primaryLight,
      selectedDayTextColor: colors.darkestGrey,
      todayTextColor: colors.primaryDark,
      dotColor: colors.darkGreen
    };
  };

  // handles when user presses on a calendar date
  // reflects it in component state, and then calls parent to save to firebase
  const onDatePressed = date => {
    setCurrentDate(date.dateString);
    if (!props.readOnly) {
      if (trackingMode) {
        setMarkedDates({
          ...markedDates,
          [date.dateString]: {
            type: strings.Reading,
            marked: true,
            selected: true,
            selectedColor: colors.green
          },
        });
      } else {
        setMarkedDates({
          [date.dateString]: {
            type: strings.Reading,
            marked: true,
            selected: true,
            selectedColor: colors.green
          },
        });
      }

      props.onDatePressed(date);
    }
  };

  return (
    <View
      style={[{ justifyContent: 'center', width:"100%" }, expanded? {height: 330} : {height: 100}]}
      key={'' + Object.keys(markedDates).length}
    >
      <CalendarProvider
        date={currentDate}
        onDayPress={props.onDatePressed}
        disabledOpacity={0.6}
      >
        {expanded ? (
          <Calendar
            current={currentDate}
            markedDates={markedDates}
            onDayPress={onDatePressed}
            theme={getTheme()}
          />
        ) : (
          <WeekCalendar
            // Collection of dates that have to be marked. Default = {}
            markedDates={markedDates}
            onDayPress={onDatePressed}
            theme={getTheme()}
            current={currentDate}
          />
        )}
      </CalendarProvider>
      {expanded ? (
        <TouchableOpacity
          style={{
            paddingTop: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            setExpanded(false);
          }}
        >
          <Icon name={"angle-up"} type="font-awesome" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            setExpanded(true);
          }}
        >
          <Icon name={"angle-down"} type="font-awesome" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DailyTracker;
