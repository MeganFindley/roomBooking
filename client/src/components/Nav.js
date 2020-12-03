import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './CSS/Nav.css';
import home from './img/ICONS/home.svg';
import homeFill from './img/ICONS/home-filled.svg';
import book from './img/ICONS/book.svg';
import bookFill from './img/ICONS/book-filled.svg';
import table from './img/ICONS/timetable.svg';
import tableFill from './img/ICONS/timetable-filled.svg';


function Nav(props) {
    const homeImgs = { normal: home, fill: homeFill };
    const bookImgs = { normal: book, fill: bookFill };
    const tableImgs = { normal: table, fill: tableFill };

    // New stuff
    console.log(props.navIcon.icon);
    let page = props.navIcon.icon;

    // const [icons, setIcons] = useState({ home: homeImgs.fill, book: bookImgs.normal, table: tableImgs.normal });
    // console.log(icons.home);
    let [homeicon, setHome] = useState('fill');
    let [bookicon, setBook] = useState('normal');
    let [tableicon, setTable] = useState('normal');
    useEffect(() => {
        const setSvgs = () => {
            if (page === 'home') {
                setHome('fill');
                setBook('normal');
                setTable('normal');
            } else if (page === 'book') {
                setHome('normal');
                setBook('fill');
                setTable('normal');
            } else if (page === 'timetable') {
                setHome('normal');
                setBook('normal');
                setTable('fill');
            }
        }
        setSvgs()
    }, [props]);

    return (
        <div className='navComp'>
            <ul className='navList'>
                <li className='pagelink'>
                    <Link tag='li' to="/">
                        <img className='homeIcon' src={homeImgs[homeicon]} alt='home svg' />
                        <span>DAY VIEW</span>
                    </Link>
                </li>
                <li className='pagelink'>
                    <Link tag='li' to="/book">
                        <img className='bookIcon' src={bookImgs[bookicon]} alt='booking svg' />
                        <span>BOOKING</span>
                    </Link>
                </li>
                <li className='pagelink'>
                    <Link style={{ textDecoration: 'none' }} tag='li' to="/timetable">
                        <img className='tableIcon' src={tableImgs[tableicon]} alt='timetable svg' />
                        <span>TIMETABLE</span>
                    </Link>
                </li>
            </ul>
        </div>
    )

}

export default Nav
