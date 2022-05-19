import styles from './Modal.module.css';

const Modal = (props) => {

    return (
        <div className={styles.container}>
            {props.children}
        </div>
    )
};

export default Modal;
