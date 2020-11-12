import React, { useState, useEffect } from 'react';
import './CSS/Home.css'

function Home() {
    const bookings = [];
    const pinkMeetings = [];
    const orangeMeetings = [];
    const blueMeetings = [];
    const [meetings, setMeetings] = useState({ pink: [], orange: [], blue: [] });
    const today = new Date().toISOString().slice(0, 10);

    useEffect(async () => {
        await fetch('https://qf4kxmgf87.execute-api.eu-west-2.amazonaws.com/test/returnbookings')
            .then(response => response.json())
            .then(data => JSON.parse(data.body).map((item, index) => {
                bookings.push(item);
            }
            ));
        console.log(bookings)
        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].date === today) {
                if (bookings[i].roomName === 'Pink' || bookings[i].roomName === 'pink') { pinkMeetings.push(bookings[i]) }
                if (bookings[i].roomName === 'Orange' ) { orangeMeetings.push(bookings[i]) }
                else if (bookings[i].roomName === 'Blue' ) { blueMeetings.push(bookings[i]) }
            }
        }
        setMeetings({ pink: pinkMeetings, orange: orangeMeetings, blue: blueMeetings });
        console.log(meetings.orange)
    }, []);


    return (
        <React.Fragment>
            <div className='homeComp'>
                <h1>Meetings Scheduled Today:</h1>
                <div className='roomTicket pink'>
                    <h3 className='roomName pinkRoom'>PINK</h3>
                    <div className='roomSchedule pinkSchedule'>
                        {meetings.pink.map(meeting => (
                            <div className='meeting'>
                                <span style={{ fontWeight: "bold" }} key='time' className='meetingTime'>{meeting.time}:</span>
                                <span style={{ fontWeight: "bold" }} key='name' className='meetingName'>{meeting.meetingName}</span>
                                <br></br>
                                <span key='about' className='meetingAbout'>{meeting.meetingHost}'s meeting will last {meeting.duration} {meeting.duration>1 ? 'hours' : 'hour'} and has {meeting.capacity} people attending.</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='roomTicket orange'>
                    <h3 className='roomName orangeRoom'>ORANGE</h3>
                    <div className='roomSchedule orangeSchedule'>
                        {meetings.orange.map(meeting => (
                            <div className='meeting'>
                                <span style={{ fontWeight: "bold" }} key='time' className='meetingTime'>{meeting.time}:</span>
                                <span style={{ fontWeight: "bold" }} key='name' className='meetingName'>{meeting.meetingName}</span>
                                <br></br>
                                <span key='about' className='meetingAbout'>{meeting.meetingHost}'s meeting will last {meeting.duration} {meeting.duration>1 ? 'hours' : 'hour'} and has {meeting.capacity} people attending.</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='roomTicket blue'>
                    <h3 className='roomName blueRoom'>BLUE</h3>
                    <div className='roomSchedule blueSchedule'>
                        {meetings.blue.map(meeting => (
                            <div className='meeting'>
                                <span style={{ fontWeight: "bold" }} key='time' className='meetingTime'>{meeting.time}:</span>
                                <span style={{ fontWeight: "bold" }} key='name' className='meetingName'>{meeting.meetingName}</span>
                                <br></br>
                                <span key='about' className='meetingAbout'>{meeting.meetingHost}'s meeting will last {meeting.duration} {meeting.duration>1 ? 'hours' : 'hour'} and has {meeting.capacity} people attending.</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home