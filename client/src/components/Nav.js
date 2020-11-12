import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './CSS/Nav.css';
import home from './img/ICONS/home.svg';
import homeFill from './img/ICONS/home-filled.svg';
import book from './img/ICONS/book.svg';
import bookFill from './img/ICONS/book-filled.svg';
import table from './img/ICONS/timetable.svg';
import tableFill from './img/ICONS/timetable-filled.svg';


function Nav(props) {
    console.log(props);
    const homeImgs = { normal: home, fill: homeFill };
    const bookImgs = { normal: book, fill: bookFill };
    const tableImgs = { normal: table, fill: tableFill };

    const [images, setIMG] = useState({ homepage: true, bookpage: false, tablepage: false });

    const toggleHome = () => { setIMG({ homepage: true, bookpage: false, tablepage: false }) };
    const toggleBook = () => { setIMG({ homepage: false, bookpage: true, tablepage: false }) };
    const toggleTable = () => { setIMG({ homepage: false, bookpage: false, tablepage: true }) };

    const getHomeImg = () => images.homepage ? 'fill' : 'normal';
    const getBookImg = () => images.bookpage ? 'fill' : 'normal';
    const getTableImg = () => images.tablepage ? 'fill' : 'normal';

    const homeSVG = getHomeImg();
    const bookSVG = getBookImg();
    const tableSVG = getTableImg();

    return (
        <div className='navComp'>
            <ul className='navList'>
                <li className='pagelink' onClick={toggleHome}>
                    <Link tag='li' to="/">
                        <img className='homeIcon' src={homeImgs[homeSVG]} alt='home svg' />
                        <span>DAY VIEW</span>
                    </Link>
                </li>
                <li className='pagelink' onClick={toggleBook}>
                    <Link tag='li' to="/book">
                        <img className='bookIcon' src={bookImgs[bookSVG]} alt='book svg' />
                        <span>BOOKING</span>
                    </Link>
                </li>
                <li className='pagelink' onClick={toggleTable}>
                    <Link style={{ textDecoration: 'none' }} tag='li' to="/timetable">
                        <img className='tableIcon' src={tableImgs[tableSVG]} alt='timetable svg' />
                        <span>TIMETABLE</span>
                    </Link>
                </li>
            </ul>
        </div>
    )

}

export default Nav
