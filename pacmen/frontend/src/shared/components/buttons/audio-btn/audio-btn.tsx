"useClient";
import { FC, useState } from "react";

import { Button } from "../..";

import { myAudioProvider } from "@/shared/aux-classes";

import styles from "./audio-btn.module.css"


export const AudioBtn: FC = () => {
    
  const [audioText, setAudioText] = useState<string>("🔊");

  const manageVolume = () => {
    const audioTexts: string[] = ["🔇", "🔉", "🔊",];
    const index = audioTexts.findIndex((text) => text === audioText);
    const newIndex = (index + 1) % audioTexts.length;
    const vol = newIndex === 0 ? 0 : newIndex === 2 ? 0.25 : 0.1;
    myAudioProvider.setVolumeAll(vol)
    setAudioText(audioTexts[newIndex]);    
  };

  return (
    <div className={styles.audio_btn_container}>
      <Button
        cKBtn={false}
        btnText={audioText}
        className={styles.audio_btn}
        CKColorSchema="none"
        onClick={() => manageVolume()}
      />
    </div>
  );
};
