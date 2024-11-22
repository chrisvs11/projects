// app/page.tsx
"use client";

import Link from "next/link";

import { Button } from "../shared/components";

import { motion } from "framer-motion";

import { GameAudios } from "@/shared/aux-classes";

import styles from "./loginPage.module.css";
import { useRouter } from "next/navigation";


export default function Page() {

  const router = useRouter()

  const gameAudio = new GameAudios()

  const activateAudio = () => {
    gameAudio.stopAllMusic()
    gameAudio.introSongMusicStart()

  }

  const goNextPage = ():void => {
    console.log("hello")
    router.push("/lobby")
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

          <Link href={"/lobby/404"}>
            <Button
              cKBtn={false}
              btnText={"Local"}
              className={styles.btn}
              CKColorSchema="green"
            />
          </Link>
            <Button
              cKBtn={false}
              btnText={"Online"}
              className={styles.btn}
              CKColorSchema="green"
              onClick={() => {
                activateAudio()
                goNextPage()
              }}
              disabled={false}
            />
        </div>
      </motion.div>
    </div>
  );
}
