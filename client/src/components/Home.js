import React, { useState, useEffect } from "react";
import "./CSS/Home.css";

function Home(props) {
    const pinkMeetings = [];
    const orangeMeetings = [];
    const blueMeetings = [];
    const [meetings, setMeetings] = useState({ pink: [], orange: [], blue: [] });
    const today = new Date().toISOString().slice(0, 10);

    let rooms = [];
    const [roomInfo, setRoomInfo] = useState({});
    const [overlay, setOverlay] = useState({ show: false });
    const pinkStyle = {
        left: "calc(100% / 15)",
        backgroundColor: "rgb(255, 214, 238)",
        closeColor2: "hotpink",
        closeColor1: "rgb(255, 214, 238)",
        closeBorder: "1px solid hotpink",
    };
    const blueStyle = {
        left: "calc(100% / 1.55)",
        backgroundColor: "rgb(191, 217, 255)",
        closeColor2: "rgb(78, 114, 255)",
        closeColor1: "rgb(191, 217, 255)",
        closeBorder: "1px solid rgb(78, 114, 255)",
    };
    const orangeStyle = {
        left: "calc(100% / 2.8)",
        backgroundColor: "rgb(255, 226, 182)",
        closeColor2: "orange",
        closeColor1: "rgb(255, 226, 182)",
        closeBorder: "1px solid orange",
    };

    const [overlayStyle, setOverlayStyle] = useState({});
    let bookings = [];
    function is_touch_device() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }
    const touch = is_touch_device();
    useEffect(() => {
        props.setNavIcon({ icon: "home" });
        const returnAllBookings = async () => {
            await fetch(
                "https://h6w57dp1q4.execute-api.eu-west-2.amazonaws.com/dev/return-booking"
            )
                .then((response) => response.json())
                .then((data) => (bookings = data));

            sortBookings(bookings);
            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].date === today) {
                    if (
                        bookings[i].roomName === "Pink" ||
                        bookings[i].roomName === "pink"
                    ) {
                        pinkMeetings.push(bookings[i]);
                    }
                    if (bookings[i].roomName === "Orange") {
                        orangeMeetings.push(bookings[i]);
                    } else if (bookings[i].roomName === "Blue") {
                        blueMeetings.push(bookings[i]);
                    }
                }
            }
            setMeetings({
                pink: pinkMeetings,
                orange: orangeMeetings,
                blue: blueMeetings,
            });
        };
        returnAllBookings();

        const sortBookings = (bookings) => {
            bookings.sort(function (a, b) {
                let aTime = a.time;
                let formattedATime = aTime.slice(0, 2);
                let bTime = b.time;
                let formattedBTime = bTime.slice(0, 2);
                return formattedATime - formattedBTime;
            });
        };

        const returnRooms = async () => {
            await fetch(
                "https://h6w57dp1q4.execute-api.eu-west-2.amazonaws.com/dev/return-rooms"
            )
                .then((response) => response.json())
                .then((data) => (rooms = data));
            setRoomInfo({ blue: rooms[0], orange: rooms[1], pink: rooms[2] });
        };
        returnRooms();
    }, []);

    const toggleOverlay = (e) => {
        if (touch) {
            setRoomInfo({
                ...roomInfo,
                viewroom: roomInfo[e.target.getAttribute("id")],
            });
            // console.log(roomInfo.viewroom)
            if (e.target.getAttribute("id") === "pink") {
                setOverlayStyle(pinkStyle);
            } else if (e.target.getAttribute("id") === "orange") {
                setOverlayStyle(orangeStyle);
            } else if (e.target.getAttribute("id") === "blue") {
                setOverlayStyle(blueStyle);
            }
            setOverlay({ show: !overlay.show });
        }
    };

    const mouseOver = (e) => {
        if (!touch) {
            setRoomInfo({
                ...roomInfo,
                viewroom: roomInfo[e.target.getAttribute("id")],
            });
            // console.log(roomInfo.viewroom)
            if (e.target.getAttribute("id") === "pink") {
                setOverlayStyle(pinkStyle);
            } else if (e.target.getAttribute("id") === "orange") {
                setOverlayStyle(orangeStyle);
            } else if (e.target.getAttribute("id") === "blue") {
                setOverlayStyle(blueStyle);
            }
            setOverlay({ show: !overlay.show });
        }
    };
    return (
        <React.Fragment>
            <div className="homeComp">
                <h1>Meetings Scheduled Today:</h1>
                <h2>
                    {touch ? "Click on " : "Hover over "} a room name to see the rooms
          capabilities
        </h2>
                <div className="roomTicket pink">
                    <h3
                        id="pink"
                        className="roomName pinkRoom"
                        onMouseEnter={mouseOver}
                        onMouseLeave={mouseOver}
                        onClick={toggleOverlay}
                    >
                        PINK
          </h3>
                    <div className="roomSchedule pinkSchedule">
                        {meetings.pink.map((meeting) => (
                            <div className="meeting">
                                <span
                                    style={{ fontWeight: "bold" }}
                                    key="time"
                                    className="meetingTime"
                                >
                                    {meeting.time}:
                </span>
                                <span
                                    style={{ fontWeight: "bold" }}
                                    key="name"
                                    className="meetingName"
                                >
                                    {meeting.meetingName}
                                </span>
                                <br></br>
                                <span key="about" className="meetingAbout">
                                    {meeting.meetingHost}'s meeting will last {meeting.duration}{" "}
                  minutes and has {meeting.capacity} people attending.
                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="roomTicket orange">
                    <h3
                        id="orange"
                        className="roomName orangeRoom"
                        name="orange"
                        onMouseEnter={mouseOver}
                        onMouseLeave={mouseOver}
                        onClick={toggleOverlay}
                    >
                        ORANGE
          </h3>
                    <div className="roomSchedule orangeSchedule">
                        {meetings.orange.map((meeting) => (
                            <div className="meeting">
                                <span
                                    style={{ fontWeight: "bold" }}
                                    key="time"
                                    className="meetingTime"
                                >
                                    {meeting.time}:
                </span>
                                <span
                                    style={{ fontWeight: "bold" }}
                                    key="name"
                                    className="meetingName"
                                >
                                    {meeting.meetingName}
                                </span>
                                <br></br>
                                <span key="about" className="meetingAbout">
                                    {meeting.meetingHost}'s meeting will last {meeting.duration}{" "}
                  minutes and has {meeting.capacity} people attending.
                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="roomTicket blue">
                    <h3
                        id="blue"
                        className="roomName blueRoom"
                        onMouseEnter={mouseOver}
                        onMouseLeave={mouseOver}
                        onClick={toggleOverlay}
                    >
                        BLUE
          </h3>
                    <div className="roomSchedule blueSchedule">
                        {meetings.blue.map((meeting) => (
                            <div className="meeting">
                                <span
                                    style={{ fontWeight: "bold" }}
                                    key="time"
                                    className="meetingTime"
                                >
                                    {meeting.time}:
                </span>
                                <span
                                    style={{ fontWeight: "bold" }}
                                    key="name"
                                    className="meetingName"
                                >
                                    {meeting.meetingName}
                                </span>
                                <br></br>
                                <span key="about" className="meetingAbout">
                                    {meeting.meetingHost}'s meeting will last {meeting.duration}{" "}
                  minutes and has {meeting.capacity} people attending.
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* room overlay */}
                <div
                    className="roomOverlay"
                    style={{
                        display: overlay.show ? "block" : "none",
                        left: overlayStyle.left,
                        backgroundColor: overlayStyle.backgroundColor,
                    }}
                >
                    <button
                        className="close"
                        style={{
                            backgroundColor: overlayStyle.closeColor2,
                            color: overlayStyle.closeColor1,
                            border: "none",
                            display: touch ? 'block' : 'none',
                        }}
                        onClick={toggleOverlay}
                    >
                        <span>x</span>
                    </button>
                    <h3 style={{ color: overlayStyle.closeColor2 }}>
                        {roomInfo.viewroom ? roomInfo.viewroom.roomName.toUpperCase() : " "}{" "}
            ROOMS CAPABILITIES
          </h3>
                    <p>
                        Capacity:{" "}
                        <span>
                            {roomInfo.viewroom ? roomInfo.viewroom.roomCapacity : " "}
                        </span>
                    </p>
                    <p>
                        Phone:{" "}
                        <span>
                            {roomInfo.viewroom ? (roomInfo.viewroom.phone ? "✓" : "✗") : " "}
                        </span>
                    </p>
                    <p>
                        Projector:{" "}
                        <span>
                            {roomInfo.viewroom
                                ? roomInfo.viewroom.projector
                                    ? "✓"
                                    : "✗"
                                : " "}
                        </span>
                    </p>
                    <p>
                        Tv:{" "}
                        <span>
                            {roomInfo.viewroom
                                ? roomInfo.viewroom.tvScreen
                                    ? "✓"
                                    : "✗"
                                : " "}
                        </span>
                    </p>
                    <p>
                        Wheelchair Access:{" "}
                        <span>
                            {roomInfo.viewroom
                                ? roomInfo.viewroom.wheelchairAccess
                                    ? "✓"
                                    : "✗"
                                : " "}
                        </span>
                    </p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;
