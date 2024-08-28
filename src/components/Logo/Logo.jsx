import styles from './style.module.css';

export function Logo({ logo }) {
    return (
        <div className={styles.logoContainer}>
            <img src={logo} alt="Logo" className={styles.logoImage} />
        </div>
    );
}
