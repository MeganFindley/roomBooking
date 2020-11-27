import React, { useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom';
import './CSS/Book.css'

function Book() {
    const history = useHistory();
    const [meetingInfo, setMeetingInfo] = useState({});
    const [editOn, setEditOn] = useState({edit: false});
    const [roomEdits, setRoomEdits] = useState();
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
        };
        setRoomEdits(roomInfo[meetingInfo.roomName]);
    };
    const setRoomDetail = (e) =>{
        let value = ''
        if(e.target.type === 'checkbox'){
            if(e.target.checked){
                value = 'true'
            }else {
                value = 'false'
            }
        }else if (e.target.type === 'number'){
            value = e.target.value
        }
        setRoomEdits({
            ...roomEdits,
            roomName: meetingInfo.roomName,
            [e.target.name]: value
        });
    };
    const [response, setResponse] = useState({show: false});
    const updateRoom = async (e) => {
        // e.preventDefault();
        await fetch('https://h6w57dp1q4.execute-api.eu-west-2.amazonaws.com/dev/update-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "queryStringParameters": roomEdits }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            toggleEdit();
        }
    const addBooking = async (e) => {
        e.preventDefault();
        console.log(meetingInfo);
        await fetch('https://h6w57dp1q4.execute-api.eu-west-2.amazonaws.com/dev/add-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "queryStringParameters": meetingInfo }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setResponse({message: data.body.message, show: true});
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const okResponse = (e) => {
        e.preventDefault();
        setResponse({...response, show: false});
        if(response.message.slice(0,5) !== 'Sorry'){
            history.goBack()
        }
    }
    let rooms = [];
    const [roomInfo, setRoomInfo] = useState({});
    useEffect(() => {
        const returnRooms = async () => {
            await fetch('https://h6w57dp1q4.execute-api.eu-west-2.amazonaws.com/dev/return-rooms')
                .then(response => response.json())
                .then(data => rooms = data);
            setRoomInfo({Blue: rooms[0], Orange: rooms[1], Pink: rooms[2]});
        };
        returnRooms();
    }, []);

    return (
        <div className='bookComp'>
            <h1>Make a Booking:</h1>
            <div className='roomSelection'>
                <h3>Select Room:</h3>
                <form id='clear'>
                    <div className='flex'>
                    <label style={{color: 'hotpink'}}>Pink</label>
                    <input id='pinkRadio' type='radio' name='roomName' value='Pink' onChange={setData} />
                    </div>
                    <div className='flex'>
                    <label style={{color: 'orange'}}>Orange</label>
                    <input id='orangeRadio' type='radio' name='roomName' value='Orange' onChange={setData} />
                    </div>
                    <div className='flex'>
                    <label style={{color: 'rgb(78, 114, 255)'}}>Blue</label>
                    <input id='blueRadio' type='radio' name='roomName' value='Blue' onChange={setData} />
                    </div>
                    <button onClick={toggleEdit} name='edit'>EDIT</button>
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
                    <label>Duration (minutes):</label>
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
                <form method='post'>
                    <h3>Edit the {meetingInfo.roomName ? meetingInfo.roomName.toUpperCase() : ''} room</h3>
                    <label>TV: </label>
                    <input onChange={setRoomDetail} className='checkbox' defaultChecked={roomEdits ? (roomEdits.tvScreen ? true : false) : ''} type='checkbox' name='tvScreen'/><br></br>
                    <label>Projector: </label>
                    <input onChange={setRoomDetail} className='checkbox' defaultChecked={roomEdits ? (roomEdits.projector ? true : false) : ''} type='checkbox' name='projector'/><br></br>
                    <label>Phone: </label>
                    <input onChange={setRoomDetail} className='checkbox' defaultChecked={roomEdits ? (roomEdits.phone ? true : false) : ''} type='checkbox' name='phone'/><br></br>
                    <label>Wheelchair Access: </label>
                    <input onChange={setRoomDetail} className='checkbox' defaultChecked={roomEdits ? (roomEdits.wheelchairAccess ? true : false) : ''} type='checkbox' name='wheelchairAccess'/><br></br>
                    <label>Capacity: </label>
                    <input onChange={setRoomDetail} type='number' name='roomCapacity' defaultValue={roomEdits ? (roomEdits.roomCapacity) : 0}/><br></br>
                    <button type='submit' onClick={updateRoom}>CONFIRM</button>
                </form>
            </div>
            <div className='message-overlay' style={{display: response.show ? 'block' : 'none'}}>
                <h1>{response.message ? response.message : ''}</h1>
                <button onClick={okResponse}>OK</button>
            </div>
        </div>
    )
}

export default Book
