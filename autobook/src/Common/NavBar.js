import React from 'react';
import {Link} from 'react-router-dom';

export default function NavBar(){
    return(
        <nav className='nav--bar'>
           <h4 className='logo'>AutoBook</h4>
           <div className='nav-items-container'>
            <Link to='/' className='nav-item'>Home</Link>
            <Link to='/about' className='nav-item'>About</Link>
            <Link to='/shop' className='nav-item'>Shop</Link>
            <Link to='/guides' className='nav-item'>Guides</Link>
            <Link to='/forum' className='nav-item'>Forum</Link>
           </div>
           <div className='profile--holder'>
            <img alt='' src={require('../Images/profilephoto4.png')} className='profile--icon'/>
           </div>
        </nav>
    )
}