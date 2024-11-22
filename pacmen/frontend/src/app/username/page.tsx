"use client";

import styles from "./username.module.css";

import { useFormik } from "formik";

import * as Yup from "yup";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { useLobbyId, useUsername } from "@/shared/hooks";

import { CollectionName, Lobby } from "@/shared/types";

import { firebaseService, useLobbyJoinMutation } from "@/shared/services";

import { Button, Input } from "@/shared/components";

interface FormValues {
  username: string;
}

const restrictedName: string[] = ["blinky", "inky", "pinky", "clyde"];

export default function Page() {
  const { setUsername } = useUsername();
  const [initialValues, setInitialValues] = useState<FormValues>({
    username:""
  })
  const { lobbyId } = useLobbyId();
  const router = useRouter();
  const [currentLobby, setCurrentLobby] = useState<Lobby>();

  const { mutate } = useLobbyJoinMutation({
    onSuccess: (data: Lobby) => {
      console.log("Join Successfully");
      router.push(`lobby/${data.uuid}`);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const saveInLocalStorage = (username: string) => {
    if(typeof window === "undefined") return ""
    localStorage.setItem("username", username);
  };

  const loadUsernameFromStorage = ():string => {
    const username:string = localStorage.getItem("username") || ""
    setUsername(username)
    return username 
  }

  const checkUsernameAvailability = (currentUsername: string): boolean => {
    const member = currentLobby?.members.find(
      (member) =>
        member.username.toLocaleLowerCase() ===
        currentUsername.toLocaleLowerCase()
    );
    return member ? false : true;
  };

  const validationSchema = Yup.object<FormValues>().shape({
    username: Yup.string()
      .required("username cannot be empty")
      .max(10, "Name cannot be more than 10 letter long")
      .test(
        "not-restricted-name",
        "Username restricted to an NPC",
        (value) => !value || !restrictedName.includes(value.toLocaleLowerCase())
      )
      .test("username taken", "Username already taken", (value) =>
        checkUsernameAvailability(value.toLocaleLowerCase().trim())
      ),
  });

  const fetchLobby = async () => {
    try {
      if (!lobbyId) return;

      const lobby = (await firebaseService.getData(
        CollectionName.LOBBIES,
        lobbyId
      )) as Lobby;
      setCurrentLobby(lobby);
    } catch (e) {
      console.error("Error", e);
    }
  };

  const joinHandler = async (username: string, lobbyId: string) => {
    mutate({ username, lobbyId });
  };

  const onSubmit = () => {
    setUsername(values.username);
    saveInLocalStorage(values.username);
    if (lobbyId) {
      joinHandler(values.username, lobbyId);
    } else {
      router.push("/lobby/new");
    }
  };

  const goBack = () => {
    router.push("/lobby");
  };

  const { values, errors, touched, handleSubmit, handleChange } =
    useFormik<FormValues>({
      initialValues,
      validationSchema,
      onSubmit,
    });

  useEffect(() => {
    fetchLobby();
    const username = loadUsernameFromStorage()
    setInitialValues({username})
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
