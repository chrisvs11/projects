"useClient";
import { FC } from "react";

import { Button } from "../..";

import { useRecoilState } from "recoil";

import { audioTextState } from "@/shared/states";

import { AudioHandler } from "@/shared/aux-classes";

interface AudioBtnProps {
  className:string
}

export const AudioBtn: FC<AudioBtnProps> = ({className}) => {
    
  const [audioText, setAudioText] = useRecoilState<string>(audioTextState);

  const manageVolume = () => {
    const audios = document.getElementsByTagName("audio");
    console.log("audios:",audios)
    const audioTexts: string[] = ["🔇", "🔉", "🔊",];
    const index = audioTexts.findIndex((text) => text === audioText);
    console.log(index);
    if (index >= 0 && audios.length > 0) {
      console.log("Managing Volume");
      for(let i = 0;i < audios.length; i++) {
        const audioHandler = new AudioHandler(audios.item(i) as unknown as HTMLAudioElement);
        const newIndex = (index + 1) % audioTexts.length;
        const vol = newIndex === 0 ? 0 : newIndex === 2 ? 1 : 0.5;
        console.log("Set Volume to: ", vol);
        setAudioText(audioTexts[newIndex]);
        audioHandler.setVolume(vol);
      }

    } else {
      console.log("audio not found");
    }
  };

  return (
    <div className={className}>
      <Button
        cKBtn={true}
        btnText={audioText}
        className={"audioBtn"}
        CKColorSchema="none"
        onClick={() => manageVolume()}
      />
    </div>
  );
};
