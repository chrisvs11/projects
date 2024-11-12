
import styles from "./404.module.css"


export default function page () {
    return(
        <div className="body">
            <div className="card">
                <p className={styles.error}>404 PAGE NOT FOUND</p>
            </div>
        </div>
    )
}