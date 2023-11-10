import styles from './navbar.module.css';

// middle section of the home page

import Logo from '../../assests/uialogo.png';
import React from "react";


function NavBar() {
  

  return (
    <div className={styles.topnavbar}>
        <img src={Logo} alt="Logo" className={styles.navbarlogo} />

        <div className={styles.navlinks}>
          <a href="/">For admin</a>
          <p>|</p>
          <a href="/produkter">Produkter</a>
          <a href="/brukere">Brukere</a>
        </div>
      </div>
  

  );
}

export default NavBar;