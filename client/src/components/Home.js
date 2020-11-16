import React, { useState, useEffect } from 'react';
import './CSS/Home.css'

function Home() {
    const bookings = [];
    const pinkMeetings = [];
    const orangeMeetings = [];
    const blueMeetings = [];
    const [meetings, setMeetings] = useState({ pink: [], orange: [], blue: [] });
    const today = new Date().toISOString().slice(0, 10);

    const rooms = [];
    const [roomInfo, setRoomInfo] = useState({});
    const [overlay, setOverlay] = useState({show: false})
    const pinkStyle = {left: 'calc(100% / 15)', backgroundColor: 'rgb(255, 214, 238)'};
    const blueStyle = {left: 'calc(100% / 1.55)', backgroundColor: 'rgb(191, 217, 255)'};
    const orangeStyle = {left: 'calc(100% / 2.8)', backgroundColor: 'rgb(255, 226, 182)'};

    const [overlayStyle, setOverlayStyle] = useState({}); 

    useEffect(() => {
        const returnBookings = async () => {
            await fetch('https://qf4kxmgf87.execute-api.eu-west-2.amazonaws.com/test/returnbookings')
                .then(response => response.json())
                .then(data => JSON.parse(data.body).map((item, index) => {
                    bookings.push(item);
                }));
            console.log(bookings);
            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].date === today) {
                    if (bookings[i].roomName === 'Pink' || bookings[i].roomName === 'pink') { pinkMeetings.push(bookings[i]) }
                    if (bookings[i].roomName === 'Orange') { orangeMeetings.push(bookings[i]) }
                    else if (bookings[i].roomName === 'Blue') { blueMeetings.push(bookings[i]) }
                };
            };
            setMeetings({ pink: pinkMeetings, orange: orangeMeetings, blue: blueMeetings });
        };
        returnBookings();
        const returnRooms = async () => {
            await fetch('https://qf4kxmgf87.execute-api.eu-west-2.amazonaws.com/test/roombooking')
                .then(response => response.json())
                .then(data => JSON.parse(data.body).map((item, index) => {
                    rooms.push(item);
                }));
            console.log(rooms);
            setRoomInfo({blue: rooms[0], orange: rooms[1], pink: rooms[2]});
        };
        returnRooms();

    }, []);

    const toggleOverlay = (e) => {
        setRoomInfo({ ...roomInfo, viewroom: roomInfo[ e.target.getAttribute('id')]});
        // console.log(roomInfo.viewroom)
        if(e.target.getAttribute('id') === 'pink'){
            setOverlayStyle(pinkStyle)
        }else if(e.target.getAttribute('id') === 'orange'){
            setOverlayStyle(orangeStyle)
        }else if(e.target.getAttribute('id') === 'blue'){
            setOverlayStyle(blueStyle)
        }
        setOverlay({show: !overlay.show});
    }

    return (
        <React.Fragment>
            <div className='homeComp'>
                <h1>Meetings Scheduled Today:</h1>
                <div className='roomTicket pink'>
                    <h3 id='pink' className='roomName pinkRoom' onMouseEnter={toggleOverlay} onMouseLeave={toggleOverlay} onClick={toggleOverlay}>PINK</h3>
                    <div className='roomSchedule pinkSchedule'>
                        {meetings.pink.map(meeting => (
                            <div className='meeting'>
                                <span style={{ fontWeight: "bold" }} key='time' className='meetingTime'>{meeting.time}:</span>
                                <span style={{ fontWeight: "bold" }} key='name' className='meetingName'>{meeting.meetingName}</span>
                                <br></br>
                                <span key='about' className='meetingAbout'>{meeting.meetingHost}'s meeting will last {meeting.duration} {meeting.duration > 1 ? 'hours' : 'hour'} and has {meeting.capacity} people attending.</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='roomTicket orange'>
                    <h3 id='orange' className='roomName orangeRoom' name='orange' onMouseEnter={toggleOverlay} onMouseLeave={toggleOverlay} onClick={toggleOverlay}>ORANGE</h3>
                    <div className='roomSchedule orangeSchedule'>
                        {meetings.orange.map(meeting => (
                            <div className='meeting'>
                                <span style={{ fontWeight: "bold" }} key='time' className='meetingTime'>{meeting.time}:</span>
                                <span style={{ fontWeight: "bold" }} key='name' className='meetingName'>{meeting.meetingName}</span>
                                <br></br>
                                <span key='about' className='meetingAbout'>{meeting.meetingHost}'s meeting will last {meeting.duration} {meeting.duration > 1 ? 'hours' : 'hour'} and has {meeting.capacity} people attending.</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='roomTicket blue'>
                    <h3 id='blue' className='roomName blueRoom' onMouseEnter={toggleOverlay} onMouseLeave={toggleOverlay} onClick={toggleOverlay}>BLUE</h3>
                    <div className='roomSchedule blueSchedule'>
                        {meetings.blue.map(meeting => (
                            <div className='meeting'>
                                <span style={{ fontWeight: "bold" }} key='time' className='meetingTime'>{meeting.time}:</span>
                                <span style={{ fontWeight: "bold" }} key='name' className='meetingName'>{meeting.meetingName}</span>
                                <br></br>
                                <span key='about' className='meetingAbout'>{meeting.meetingHost}'s meeting will last {meeting.duration} {meeting.duration > 1 ? 'hours' : 'hour'} and has {meeting.capacity} people attending.</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* room overlay */}
                <div className='roomOverlay' style={{display: overlay.show ? 'block' : 'none' , left: overlayStyle.left, backgroundColor: overlayStyle.backgroundColor}}>
                    <h3>{roomInfo.viewroom ? roomInfo.viewroom.roomName : ' '} rooms capabilities</h3>
                    <p>Capacity is {roomInfo.viewroom ? roomInfo.viewroom.capacity : ' '} people</p>
                    <p>{roomInfo.viewroom ? (roomInfo.viewroom.phone ? 'Has ' : 'Does not have ') : ' '} a phone</p>
                    <p>{roomInfo.viewroom ? (roomInfo.viewroom.projector ? 'Has ' : 'Does not have ') : ' '} a projector</p>
                    <p>{roomInfo.viewroom ? (roomInfo.viewroom.tvScreen ? 'Has ' : 'Does not have ') : ' '} a TV</p>
                    <p>{roomInfo.viewroom ? (roomInfo.viewroom.wheelchairAccess ? 'Is ' : 'Is not ') : ' '} wheelchair accessible</p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home