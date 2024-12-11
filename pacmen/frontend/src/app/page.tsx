// app/page.tsx
"use client";
import Link from "next/link";

import { Button } from "../shared/components";

import { motion } from "framer-motion";

import styles from "./loginPage.module.css";

export default function Page() {
  return (
    <div className={styles.loginBody}>
       
      <motion.div
        animate={{ x: "0px", scale: 1 }}
        initial={{ x: "1000px", scale: 0 }}
        className={styles.card}
      >
        <div className={styles.title}> </div>
        <div className={styles.btn_container}>
          <Link href={"/lobby"}>
            <Button
              cKBtn={false}
              btnText={"LET´s PLAY"}
              className={styles.btn}
              CKColorSchema="green"
              disabled={false}
            />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
