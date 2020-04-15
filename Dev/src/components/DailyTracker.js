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

  let dates = {};
  if (props.data && props.data.length > 0) {
    let keys = Object.keys[props.data];
    dates.map((date, index) => {
      dates = {
        ...dates,
        [keys[index]]: {
          ...date,
          marked: true,
          selected: true,
          selectedColor: colors.green,
        }
      };
    });
  }
  const [markedDates, setMarkedDates] = useState(dates);

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

  const onDatePressed = date => {
    setMarkedDates({
      ...markedDates,
      [date.dateString]: {
        type: strings.Reading,
        marked: true,
        selected: true,
        selectedColor: colors.green
      },
    });

    console.log("newState: " + JSON.stringify(markedDates));

    props.onDatePressed(date);
  };

  var today = new Date();
  const todaysDate = `${today.getFullYear()}-${(
    "0" +
    (today.getMonth() + 1)
  ).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;

  return (
    <View
      style={{ justifyContent: 'center' }}
      key={'' + Object.keys(markedDates).length}
    >
      <CalendarProvider
        date={todaysDate}
        onDayPress={props.onDatePressed}
        disabledOpacity={0.6}
      >
        {expanded ? (
          <Calendar
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
          />
        )}
      </CalendarProvider>
      {expanded ? (
        <TouchableOpacity
          style={{
            flex: 2,
            paddingTop: 10,
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
