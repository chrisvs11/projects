import { FC } from "react";
import styles from "./loading-btn.module.css";

interface LoadingBtnProps {
    animationActivator:boolean
    btnText:string
    onClick:() => void
}

export const LoadingBtn:FC<LoadingBtnProps> = () => {

    return (
        <button className={styles.loading + styles.animating}></button>
    )
}