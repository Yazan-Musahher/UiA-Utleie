import styles from './navbar.module.css';
import Logo from '../assests/uialogo.png';
import React from "react";

function NavBar() {
  return (
    <div className={styles.topnavbar}>
      <img src={Logo} alt="Logo" className={styles.navbarlogo} />
      <div className={styles.navlinks}>
        <a href="#">For Admin</a>
        <a href="#">Produkter</a>
        <a href="#">Brukere</a>
      </div>
    </div>
  );
}

export default NavBar;
