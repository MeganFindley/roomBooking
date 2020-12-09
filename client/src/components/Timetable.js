import React, { Component } from "react";
import {
  DayPilotCalendar,
  DayPilotNavigator,
  DayPilot,
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
        console.log(args.start.value)
        let eStart = args.start.value.slice(0, 10);
        let eTime = args.start.value.slice(11, 16);
        let eRoom = this.state.room;
        DayPilot.Modal.alert('Redirecting to booking page')
        .then(window.location = window.location.origin + `/book?start=${eStart}&time=${eTime}&room=${eRoom}`)
      },
      eventDeleteHandling: "Disabled",
      room: '',
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
    let buttonName = e.target.value;
    this.setState({ ...this.state, room: buttonName });

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
      <div className='tableComp'>
        <div className='timetable-text'>
          <h1>Weekly View:</h1>
          <p>Choose a room to view by clicking the buttons below and choose your week via the calander. <br></br>Click any empty slot to book it.</p>
        </div>
        <div id="timetable-buttons">
          <button id='pi'value="Pink" onClick={this.sortData}>
            PINK
          </button>
          <button id='or'value="Orange" onClick={this.sortData}>
            ORANGE
          </button>
          <button id='bl'value="Blue" onClick={this.sortData}>
            BLUE
          </button>
        </div>
        <div style={styles.wrap}>
          <div style={styles.left} className='weekView'>
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
          <div style={styles.main} className='monthView' >
            <DayPilotCalendar
              {...config}
              ref={(component) => {
                this.calendar = component && component.control;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
