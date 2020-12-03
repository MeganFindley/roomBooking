import React, { Component } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "daypilot-pro-react";
import "./CSS/Timetable.css";

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    width: "200px",
    marginTop: "15%",
    marginRight: "40px",
    marginLeft: "200px",
  },
  main: {
    flexGrow: "1",
  },
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: "Week",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: (args) => {
        let dp = this.calendar;
        DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function (
          modal
        ) {
          dp.clearSelection();
          if (!modal.result) {
            return;
          }
          dp.events.add(
            new DayPilot.Event({
              start: args.start,
              end: args.end,
              id: DayPilot.guid(),
              text: modal.result,
            })
          );
        });
      },
      eventDeleteHandling: "Update",
      onEventClick: (args) => {
        let dp = this.calendar;
        DayPilot.Modal.prompt("Update event text:", args.e.text()).then(
          function (modal) {
            if (!modal.result) {
              return;
            }
            args.e.data.text = modal.result;
            dp.events.update(args.e);
          }
        );
      },
    };
  }

  componentDidMount() {
    let today = new Date().toISOString().slice(0, 10);
    this.setState({ startDate: today });
    this.props.setNavIcon({ icon: "timetable" });
  }

  fetchBookings = async (buttonName) => {
    await fetch(
      "https://h6w57dp1q4.execute-api.eu-west-2.amazonaws.com/dev/return-booking"
    )
      .then((response) => response.json())
      .then((data) => this.manipulateData(data, buttonName));
  };
  sortData = (e) => {
    let buttonName = e.target.innerText;
    this.fetchBookings(buttonName);
  };
  manipulateData = (data, buttonName) => {
    let bookingsArray = [];
    data.map((item, index) => {
      if (item.roomName === buttonName) {
        let start = new Date(item.date + "T" + item.time + ":00");
        let end = new Date(start.getTime() + item.duration * 60000);
        bookingsArray.push({
          id: item.meetingName,
          text: item.meetingName + " - " + item.meetingHost,
          start: start,
          end: end,
        });
      }
    });
    this.setState({
      events: bookingsArray,
    });
  };

  render() {
    var { ...config } = this.state;
    let today = new Date().toISOString().slice(0, 10);
    return (
      <>
        <div id="timetable-buttons">
          <button value="Orange" onClick={this.sortData}>
            Orange
          </button>
          <button value="Blue" onClick={this.sortData}>
            Blue
          </button>
          <button value="Pink" onClick={this.sortData}>
            Pink
          </button>
        </div>
        <div style={styles.wrap}>
          <div style={styles.left}>
            <DayPilotNavigator
              selectMode={"week"}
              showMonths={1}
              skipMonths={1}
              startDate={today}
              selectionDay={"2021-09-15"}
              onTimeRangeSelected={(args) => {
                this.setState({
                  startDate: args.day,
                });
              }}
            />
          </div>
          <div style={styles.main}>
            <DayPilotCalendar
              {...config}
              ref={(component) => {
                this.calendar = component && component.control;
              }}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Calendar;
