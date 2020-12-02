import React, {useEffect} from 'react'

function Timetable(props) {
    useEffect(() => {
        props.setNavIcon({icon: 'timetable'});
    }, [])
    return (
        <div>
            
        </div>
    )
}

export default Timetable
