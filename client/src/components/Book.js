import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import './CSS/Book.css'

function Book(props) {
    const history = useHistory();
    const [meetingInfo, setMeetingInfo] = useState({});
    const [editOn, setEditOn] = useState({ edit: false });
    const [roomEdits, setRoomEdits] = useState({roomName: ''});
    const setData = (e) => {
        setMeetingInfo({
            ...meetingInfo,
            [e.target.name]: e.target.value
        });
        setRoomEdits(roomInfo[e.target.value.toLowerCase()]);
        // console.log(roomEdits);
    };
    const toggleEdit = (e) => {
        e.preventDefault();
        if (roomEdits.roomName !== '') {
            setEditOn({ edit: !editOn.edit });
        };
        if (roomEdits.roomName === 'Pink') {
            setOverlayStyle(pinkStyle);
        } else if (roomEdits.roomName ===  'Orange') {
            setOverlayStyle(orangeStyle);
        } else if (roomEdits.roomName === 'Blue') {
            setOverlayStyle(blueStyle);
        }
    };
    const setRoomDetail = (e) => {
        let value = ''
        if (e.target.type === 'checkbox') {
            console.log(e.target.checked);
            if (e.target.checked) {
                value = true;
            } else {
                value = false;
            }
        } else if (e.target.type === 'number') {
            value = e.target.value
        }
        setRoomEdits({
            ...roomEdits,
            [e.target.name]: value
        });
        console.log(roomEdits);
    };
    const [response, setResponse] = useState({ show: false });
    const updateRoom = async (e) => {
        e.preventDefault();
        console.log(e.type);
        await fetch('https://h6w57dp1q4.execute-api.eu-west-2.amazonaws.com/dev/update-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "queryStringParameters": roomEdits }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data.message);
                setResponse({...response, show: true, message: data.message});
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        if (meetingInfo.roomName) {
            setEditOn({ edit: !editOn.edit })
        };
        setRoomEdits(roomInfo[meetingInfo.roomName]);
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
                setResponse({ message: data.body.message, show: true });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const okResponse = (e) => {
        e.preventDefault();
        setResponse({ ...response, show: false });
        if(response.message === 'Room updated successfully'){}
        else if (response.message.slice(0, 5) !== 'Sorry') {
            history.goBack()
        }
    }
    let rooms = [];
    const [roomInfo, setRoomInfo] = useState({});
    const [overlay, setOverlay] = useState({ show: false });
    const pinkStyle = { backgroundColor: 'rgb(255, 214, 238)', closeColor2: 'hotpink', closeColor1: 'rgb(255, 214, 238)', closeBorder: '1px solid hotpink' };
    const blueStyle = { backgroundColor: 'rgb(191, 217, 255)', closeColor2: 'rgb(78, 114, 255)', closeColor1: 'rgb(191, 217, 255)', closeBorder: '1px solid rgb(78, 114, 255)' };
    const orangeStyle = { backgroundColor: 'rgb(255, 226, 182)', closeColor2: 'orange', closeColor1: 'rgb(255, 226, 182)', closeBorder: '1px solid orange' };
    const [overlayStyle, setOverlayStyle] = useState({});
    useEffect(() => {
        props.setNavIcon({icon: 'book'});
        const returnRooms = async () => {
            await fetch('https://h6w57dp1q4.execute-api.eu-west-2.amazonaws.com/dev/return-rooms')
                .then(response => response.json())
                .then(data => rooms = data);
            setRoomInfo({ blue: rooms[0], orange: rooms[1], pink: rooms[2] });
        };
        returnRooms();
    }, []);
    const toggleOverlay = (e) => {
        setRoomInfo({ ...roomInfo, viewroom: roomInfo[e.target.getAttribute('id')] });
        // console.log(roomInfo.viewroom)
        if (e.target.getAttribute('id') === 'pink') {
            setOverlayStyle(pinkStyle)
        } else if (e.target.getAttribute('id') === 'orange') {
            setOverlayStyle(orangeStyle)
        } else if (e.target.getAttribute('id') === 'blue') {
            setOverlayStyle(blueStyle)
        }
        setOverlay({ show: !overlay.show });
    }


    return (
        <div className='bookComp'>
            <h1>Make a Booking:</h1>
            <div className='roomSelection'>
                <h3>Select Room:</h3>
                <form id='clear'>
                    <div className='flex'>
                        <label id='pink' style={{ color: 'hotpink' }} onClick={toggleOverlay}>Pink</label>
                        <input id='pinkRadio' type='radio' name='roomName' value='Pink' onChange={setData} />
                    </div>
                    <div className='flex'>
                        <label id='orange' style={{ color: 'orange' }} onClick={toggleOverlay}>Orange</label>
                        <input id='orangeRadio' type='radio' name='roomName' value='Orange' onChange={setData} />
                    </div>
                    <div className='flex'>
                        <label id='blue' style={{ color: 'rgb(78, 114, 255)' }} onClick={toggleOverlay}>Blue</label>
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
                    <div>
                        <button type='submit' onClick={addBooking}>CONFIRM</button>
                    </div>

                </form>
            </div>
            <div className='edit-overlay' style={{ display: editOn.edit ? 'block' : 'none' , backgroundColor: overlayStyle.backgroundColor}}>
                <button className='close' onClick={toggleEdit} style={{ backgroundColor: overlayStyle.closeColor2, color: overlayStyle.closeColor1, border: 'none'}}><span>x</span></button>
                <h3 style={{ color: overlayStyle.closeColor2 }}>Edit the {roomEdits? (roomEdits.roomName ? roomEdits.roomName.toUpperCase() : '') : ''} room</h3>
                <form method='post'>
                    <label>TV: </label>
                    <input onChange={setRoomDetail} className='checkbox' checked={roomEdits ? roomEdits.tvScreen : false} type='checkbox' name='tvScreen' /><br></br>
                    <label>Projector: </label>
                    <input onChange={setRoomDetail} className='checkbox' checked={roomEdits ? roomEdits.projector : false} type='checkbox' name='projector' /><br></br>
                    <label>Phone: </label>
                    <input onChange={setRoomDetail} className='checkbox' checked={roomEdits ? roomEdits.phone : false} type='checkbox' name='phone' /><br></br>
                    <label>Wheelchair Access: </label>
                    <input onChange={setRoomDetail} className='checkbox' checked={roomEdits ? roomEdits.wheelchairAccess : false} type='checkbox' name='wheelchairAccess' /><br></br>
                    <label>Capacity: </label>
                    <input id='inputCapacity' min='1' onChange={setRoomDetail} type='number' name='roomCapacity' value={roomEdits ? roomEdits.roomCapacity : 0} /><br></br>
                    <button type='submit' onClick={updateRoom} style={{ backgroundColor: overlayStyle.closeColor2, color: overlayStyle.closeColor1, border: 'none', fontWeight: '500'}}>CONFIRM</button>
                </form>
            </div>
            <div className='message-overlay' style={{ display: response.show ? 'block' : 'none' }}>
                <h1>{response.message ? response.message : ''}</h1>
                <button onClick={okResponse}>OK</button>
            </div>

            {/* room overlay */}
            <div className='roomOverlay' style={{ display: overlay.show ? 'block' : 'none', backgroundColor: overlayStyle.backgroundColor }}>
                <button className='close' style={{ backgroundColor: overlayStyle.closeColor2, color: overlayStyle.closeColor1, border: 'none'}}onClick={toggleOverlay}><span>x</span></button>
                <h3 style={{ color: overlayStyle.closeColor2 }}>{roomInfo.viewroom ? roomInfo.viewroom.roomName.toUpperCase() : ' '} ROOMS CAPABILITIES</h3>
                <p>Capacity: <span>{roomInfo.viewroom ? roomInfo.viewroom.roomCapacity : ' '}</span></p>
                <p>Phone: <span>{roomInfo.viewroom ? (roomInfo.viewroom.phone ? '✓' : '✗') : ' '}</span></p>
                <p>Projector: <span>{roomInfo.viewroom ? (roomInfo.viewroom.projector ? '✓' : '✗') : ' '}</span></p>
                <p>Tv: <span>{roomInfo.viewroom ? (roomInfo.viewroom.tvScreen ? '✓' : '✗') : ' '}</span></p>
                <p>Wheelchair Access: <span>{roomInfo.viewroom ? (roomInfo.viewroom.wheelchairAccess ? '✓' : '✗') : ' '}</span></p>
            </div>
        </div>
    )
}

export default Book
