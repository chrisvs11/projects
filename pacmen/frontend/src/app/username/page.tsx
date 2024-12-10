"use client";

import styles from "./username.module.css";

import { useFormik } from "formik";

import * as Yup from "yup";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { CollectionName, Lobby } from "@/shared/types";

import { firebaseService } from "@/shared/services";

import { Button, Input } from "@/shared/components";

import { useCustomQuery } from "@/shared/hooks";

import { myAudioProvider, SessionStorage } from "@/shared/aux-classes";

interface FormValues {
  username: string;
}

const RESTRICTED_NAMES: string[] = ["blinky", "inky", "pinky", "clyde"];

export default function Page() {
  const [lobby, setLobby] = useState<Lobby>();
  const {joinLobby} = useCustomQuery()
  const router = useRouter();
  const checkUsernameAvailability = (username: string): boolean => {
    if (!lobby) return true;
    const isAvailable: boolean = lobby.members.every(
      (member) =>
        member.username.toLocaleLowerCase() !== username.toLocaleLowerCase()
    );
    return isAvailable;
  };

  const autoRouter = (lobbyId:string) => {
    const isMemberAlready = SessionStorage.getValue("activeMember")
    if(lobbyId && isMemberAlready) router.push(`lobby/${lobbyId}`);
  }

  const validationSchema = Yup.object<FormValues>().shape({
    username: Yup.string()
      .required("username cannot be empty")
      .max(10, "Name cannot be more than 10 letter long")
      .test(
        "not-restricted-name",
        "Username restricted to an NPC",
        (value) => !value || !RESTRICTED_NAMES.includes(value.toLocaleLowerCase())
      )
      .test("username taken", "Username already taken", (value) =>
        checkUsernameAvailability(value.toLocaleLowerCase().trim())
      ),
  });

  const fetchLobby = async (lobbyId:string) => {
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
    try{
      await joinLobby({username,lobbyId})
      router.push(`lobby/${lobbyId}`);
    } catch(e) {
      console.error(e)
    }
  };

  const onSubmit = () => {
    const lobbyId = SessionStorage.getValue("lobbyId");
    SessionStorage.setValue("username", values.username);
    if (!lobbyId) return router.push("/lobby/new");
    joinHandler(values.username, lobbyId);
  };

  const goBack = () => {
    router.push("/lobby");
  };

  const { values, errors, touched, handleSubmit, handleChange } =
    useFormik<FormValues>({
      initialValues:{username:SessionStorage.getValue("username")},
      validationSchema,
      onSubmit,
    });


  useEffect(() => {
    const lobbyId = SessionStorage.getValue("lobbyId") || ""
    fetchLobby(lobbyId);
    myAudioProvider.playIntroSongMusic(true)
    //If join to a lobby previously, it will go there
    autoRouter(lobbyId)
    return (() => {
      myAudioProvider.playIntroSongMusic(false)
    })
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
