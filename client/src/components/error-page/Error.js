import styles from './Error.module.css';

const Error = props => {
    return(
        <div className={styles.container}>
            <h1 className={styles.big_letters}>Page not found.</h1>
            <h4 className={styles.sorry}>Sorry about that.</h4>
        </div>
    )
};

export default Error;