import React from "react";
import bigman from '../assets/bigman.png';
import '../styles/header.css';


function Header(){
    return(
        <>
        <header className="header">
            <img src={bigman} alt="bacground man" className="header-bg"/>
            <div className="header-content">
                <h1>Put Your Money To Work</h1>
                <h3> Buy From Us Now !</h3>
                <button>Start Buying</button>

            </div>


        </header>
        
        </>
    )
}export default Header


