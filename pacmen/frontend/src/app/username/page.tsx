"use client";

import styles from "./username.module.css";

import { useFormik } from "formik";

import * as Yup from "yup";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { CollectionName, Lobby, Session, UserSession } from "@/shared/types";

import { firebaseService } from "@/shared/services";

import { Button, Input } from "@/shared/components";

import { useCustomQuery } from "@/shared/hooks";

import { myAudioProvider } from "@/shared/aux-classes";

const RESTRICTED_NAMES: string[] = ["blinky", "inky", "pinky", "clyde"];
interface FormValues {
  username: string;
}
const session: Session = UserSession.getInstance();

export default function Page() {
  const [lobby, setLobby] = useState<Lobby>();
  const [lobbyId,setLobbyId] = useState<string>()
  const { joinLobby } = useCustomQuery();
  const router = useRouter();


  const checkUsernameAvailability = (username: string): boolean => {
    if (!lobby) return true;

    const isAvailable: boolean = lobby.members.every(
      (member) =>
        member.username.toLocaleLowerCase() !== username.toLocaleLowerCase()
    );
    return isAvailable;
  };


  const validationSchema = Yup.object<FormValues>().shape({
    username: Yup.string()
      .required("username cannot be empty")
      .max(10, "Name cannot be more than 10 letter long")
      .test(
        "not-restricted-name",
        "Username restricted to an NPC",
        (value) =>
          !value || !RESTRICTED_NAMES.includes(value.toLocaleLowerCase())
      )
      .test("username taken", "Username already taken", (value) =>
        checkUsernameAvailability(value.toLocaleLowerCase().trim())
      ),
  });

  const fetchLobby = async (lobbyId: string) => {
    try {
      const lobby = (await firebaseService.getData(
        CollectionName.LOBBIES,
        lobbyId
      )) as Lobby;
      setLobby(lobby);
    } catch (e) {
      console.error("Error", e);
    }
  };

  const joinHandler = async (username: string, lobbyId: string) => {
    try {
      await joinLobby({ username, lobbyId });
      router.push(`lobby/${lobbyId}`);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = () => {
    const lobbyId = session.getSession()?.lobbyId;
    session.startSession(values.username);
    session.saveInSessionStorage()
    if (!lobbyId) {
      return router.push("/lobby/new");
    } else {
      joinHandler(values.username, lobbyId);
    }
  };

  const goBack = () => {
    router.push("/lobby");
  };

  const { values, errors, touched, handleSubmit, handleChange } =
    useFormik<FormValues>({
      initialValues: { username: session.getSession().username },
      validationSchema,
      onSubmit,
    });

  useEffect(() => {
    if(!lobbyId) return 
    fetchLobby(lobbyId);
  },[lobbyId])

  useEffect(() => {
    const lobbyId = session.getSession().lobbyId
    setLobbyId(lobbyId)
    myAudioProvider.playIntroSongMusic(true);
    //If join to a lobby previously, it will go there
    return () => {
      myAudioProvider.playIntroSongMusic(false);
    };
  }, []);

  return (
    <div className="body">
      <div className={`card ${styles.card}`}>
        <form className={styles.form} action="submit" onSubmit={handleSubmit}>
          <Input
            name="username"
            ckStyle={true}
            className={styles.input}
            value={values.username}
            placeholder="Enter Username"
            onChange={handleChange}
            error={touched.username ? errors.username : ""}
          />
          <div className={styles.btn_container}>
            <Button
              btnText="CONFIRM"
              className={`${styles.btn} continue`}
              cKBtn
              type="submit"
            />
          </div>
        </form>
      </div>
      <div className={styles.btn_cancel}>
        <Button
          btnText="BACK"
          className={`${styles.btn} cancel`}
          cKBtn
          onClick={goBack}
        ></Button>
      </div>
    </div>
  );
}
