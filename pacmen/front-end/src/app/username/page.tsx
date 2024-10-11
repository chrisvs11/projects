"use client";

import {
  Button,
  CollectionNames,
  Input,
  Lobby,
  useLobbyId,
  useLobbyJoinMutation,
} from "@/shared";

import styles from "./username.module.css";

import Link from "next/link";

import { useFormik } from "formik";

import * as Yup from "yup";

import { useUsername } from "@/shared/hooks/username.hook";

import { useRouter } from "next/navigation";

import FirebaseService from "@/shared/services/firebase-service";

import { useEffect, useState } from "react";

interface FormValues {
  username: string;
}

const restrictedName: string[] = ["blinky", "inky", "pinky", "clyde"];

const firebaseService = new FirebaseService();

export default function Page() {
  const { username, setUsername } = useUsername();
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
    localStorage.setItem("username", username);
  };

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
      const lobby = (await firebaseService.getData(
        CollectionNames.LOBBIES,
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
    console.log("adding:", values.username);
    setUsername(values.username);
    saveInLocalStorage(values.username);
    if (lobbyId) {
      joinHandler(values.username, lobbyId);
    } else {
      router.push("/lobby/new");
    }
  };

  const initialValues: FormValues = {
    username:username,
  };


  const { values, errors, touched, handleSubmit, handleChange } =
    useFormik<FormValues>({
      initialValues,
      validationSchema,
      onSubmit,
    });


  useEffect(() => {
    fetchLobby();
  }, []);

  return (
    <div className="body">
      <div className="card">
         <div className={styles.username_card}>
          <form className={styles.form} action="submit" onSubmit={handleSubmit}>
            <label className={styles.label}>Enter Username</label>
            <Input
              name="username"
              ckStyle={true}
              className={styles.input}
              value={values.username}
              placeholder="Put Username"
              onChange={handleChange}
              error={touched.username ? errors.username : ""}
            />
            <div className={styles.btn_container}>
              <Link href={"/"}>
                <Button btnText="Cancel" className={styles.btn} cKBtn />
              </Link>
              <Button
                btnText="Next"
                className={styles.btn}
                cKBtn
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
