import styles from './Header.module.css';
import logo from '../../assets/whitebook.svg';


export function Header() {
  return (
    <header className={styles.header}>
      <img src={logo} alt="Whitebook" className={styles.logo} />
    </header>
  );
}