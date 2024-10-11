"use client";

import { useCallback, useState } from "react";

import Link from "next/link";

import {
  Button,
  Direction,
  GhostSprite,
  GhostTypes,
  Input,
  PacmanSprite,
} from "../../../shared/components";

import { useFormik } from "formik";

import * as Yup from "yup";

import FirebaseService from "@/shared/services/firebase-service";

import { CollectionNames, Lobby, useLobbyId } from "@/shared";

import styles from "./privatePage.module.css";


interface FormValues {
  code: string;
}

const initialValues: FormValues = {
  code: "",
};

const validationSchema = Yup.object<FormValues>().shape({
  code: Yup.string()
    .min(6, "Code are 6 digits long")
    .max(6, "Code are 6 digits long")
    .required("Code cannot be empty"),
});

const firebaseService = new FirebaseService();

export default function PrivatePage() {

  const [incorrectPassword, setIncorrectPassword] = useState<boolean>(false);

  const { lobbyId, setLobbyId } = useLobbyId();

  const checkPassword = async (password: string): Promise<Lobby | null> => {
    try {
      const fetchedLobbies: Lobby[] =
        await firebaseService.getAllDocsInCollection(CollectionNames.LOBBIES);
      const lobby = fetchedLobbies.find(
        (lobby) => !lobby.deletedAt && lobby.code === password
      );

      if (lobby && lobby.members.length < lobby.maxPlayers) {
        setIncorrectPassword(false);
        setLobbyId(lobby.id);
        return lobby;
      } else {
        setIncorrectPassword(true);
        setLobbyId("");
        return null;
      }
    } catch (e) {
      console.error("Error");
      return null;
    }
  };

  const onSubmit = useCallback(
    async (values: FormValues) => {
      
      const lobby: Lobby | null = await checkPassword(values.code);

      return lobby
    },
    [checkPassword]
  );

  const { values, errors, touched, handleSubmit, handleChange } =
    useFormik<FormValues>({
      initialValues,
      validationSchema,
      onSubmit,
    });

  return (
    <div className="body">
      <div className={"card"}>
        <div className={styles.title}>Join Private Lobby</div>
        <div className={styles.form_container}>
          <div className={styles.pacman}></div>
          <form className={styles.form} action="submit" onSubmit={handleSubmit}>
            <label htmlFor="Code" className={styles.label}>
              Lobby Private Code
            </label>
            <Input
              ckStyle={true}
              name="code"
              value={values.code}
              type="text"
              placeholder="put room code"
              className={`${styles.input}`}
              onChange={handleChange}
              error={touched.code ? errors.code : undefined}
            />
            {lobbyId && <div className={styles.valid}>Code Is Valid</div>}
            <Button
              cKBtn={true}
              btnText={"CHECK CODE"}
              className={styles.btn}
              type="submit"
            />
          </form>
        </div>
        <div className={styles.card_footer}>
          <Link href={"/lobby"}>
            <Button cKBtn={true} btnText={"Cancel"} className={styles.cancel} />
          </Link>
          {incorrectPassword && (
            <div className={styles.errorMessage}>
              Not Available Lobby Found
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <PacmanSprite
                  state={0}
                  velocity={0.9}
                  scale={1.2}
                  rotation={180}
                />
                <GhostSprite
                  state={0}
                  type={GhostTypes.BLINKY}
                  direction={Direction.LEFT}
                  scale={1.5}
                />
              </div>
            </div>
          )}
          {lobbyId && (
            <Link href={"/username"}>
              <Button btnText="Join Lobby" cKBtn className={styles.join} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
