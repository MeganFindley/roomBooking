import React, { useState } from 'react'
import './CSS/Book.css'

function Book() {

    const [meetingInfo, setMeetingInfo] = useState({});
    const [editOn, setEditOn] = useState({edit: false});
    const [roomEdits, setRoomEdits] = useState({});

    const setData = (e) => {
        setMeetingInfo({
            ...meetingInfo,
            [e.target.name]: e.target.value
        });
    };
    const toggleEdit = (e) => {
        e.preventDefault();
        if(meetingInfo.roomName){
            setEditOn({edit: !editOn.edit})
        }
    };
    const setRoomDetail = (e) =>{
        setRoomEdits({
            ...roomEdits,
            [e.target.name]: e.target.value
        })
    };
    const addBooking = async (e) => {
        e.preventDefault();
        console.log(meetingInfo);
        await fetch('https://qf4kxmgf87.execute-api.eu-west-2.amazonaws.com/test/roombooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "queryStringParameters": meetingInfo }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }

    return (
        <div className='bookComp'>
            <h1>Make a Booking:</h1>
            <div className='roomSelection'>
                <h3>Select Room:</h3>
                <form id='clear'>
                    <label>Pink</label>
                    <input type='radio' name='roomName' value='Pink' onChange={setData} />
                    <label>Orange</label>
                    <input type='radio' name='roomName' value='Orange' onChange={setData} />
                    <label>Blue</label>
                    <input type='radio' name='roomName' value='Blue' onChange={setData} />
                    <button onClick={toggleEdit} name='edit'>Edit</button>
                </form>
            </div>
            <div className='helpInfo'>
                <p>Click a room name to view information about its facilities. If these don't meet your requirements please click edit to customise your room</p>
            </div>
            <div className='meetingDetails'>
                <h3>Meeting Details:</h3>
                <form method='post' className='clear'>
                    <label>Date:</label>
                    <input type='date' name='date' onChange={setData} /><br></br>
                    <label>Time:</label>
                    <input type='time' name='time' onChange={setData} /><br></br>
                    <label>Duration</label>
                    <input type='number' name='duration' onChange={setData} /><br></br>
                    <label>Attendees:</label>
                    <input type='number' name='capacity' onChange={setData} /><br></br>
                    <label>Meeting Name:</label>
                    <input type='text' name='meetingName' onChange={setData} /><br></br>
                    <label>Your Name:</label>
                    <input type='text' name='meetingHost' onChange={setData} /><br></br>
                    <button type='submit' onClick={addBooking}>CONFIRM</button>
                </form>
            </div>
            <div className='edit-overlay' style={{display: editOn.edit ? 'block' : 'none' }}>
                <form>
                    <h3>Edit the {meetingInfo.roomName ? meetingInfo.roomName.toUpperCase() : ''} room</h3>
                    <label>TV: </label>
                    <input onChange={setRoomDetail} className='checkbox' type='checkbox' name='TV'/><br></br>
                    <label>Projector: </label>
                    <input onChange={setRoomDetail} className='checkbox' type='checkbox' name='projector'/><br></br>
                    <label>Phone: </label>
                    <input onChange={setRoomDetail} className='checkbox' type='checkbox' name='phone'/><br></br>
                    <label>Capacity: </label>
                    <input onChange={setRoomDetail} type='number' name='capacity'/><br></br>
                    <button onClick={toggleEdit}>CONFIRM</button>
                </form>
            </div>
        </div>
    )
}

export default Book
