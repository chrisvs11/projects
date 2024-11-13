// app/page.tsx
"use client";

import Link from "next/link";

import { Button } from "../shared/components";

import { motion } from "framer-motion";

import { GameAudios } from "@/shared/aux-classes";

import styles from "./loginPage.module.css";


export default function Page() {

  const gameAudio = new GameAudios()

  const activateAudio = () => {
    gameAudio.introSongMusicStart()
  }


  return (
    <div className={styles.loginBody}>

      <motion.div
        animate={{ x: "0px", scale: 1 }}
        initial={{ x: "1000px", scale: 0 }}
        className={styles.card}
      >       
        
        <div className={styles.title}> </div>
        <div className={styles.btn_container}>

          <Link href={"/lobby/room"}>
            <Button
              cKBtn={false}
              btnText={"Local"}
              className={styles.btn}
              CKColorSchema="green"
            />
          </Link>

          <Link href={"/lobby"}>
            <Button
              cKBtn={false}
              btnText={"Online"}
              className={styles.btn}
              CKColorSchema="green"
              onClick={() => activateAudio()}
            />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
