import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; // import css module

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>BlueMoon</h1>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/about" className={styles.link}>About</Link>
        <Link to="/login" className={styles.link}>Login</Link>
      </nav>
    </header>
  );
}
