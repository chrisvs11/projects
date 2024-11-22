"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import {
  Button,
  GhostSprite,
  Input,
  PacmanSprite,
} from "../../../shared/components";

import { useFormik } from "formik";

import * as Yup from "yup";

import { useLobbyId } from "@/shared/hooks";

import styles from "./privatePage.module.css";

import { Lobby, CollectionName, GhostTypes, Direction } from "@/shared/types";

import { useRouter } from "next/navigation";
import { firebaseService } from "@/shared/services";

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


export default function PrivatePage() {
  const [incorrectPassword, setIncorrectPassword] = useState<boolean>(false);
  const { lobbyId, setLobbyId } = useLobbyId();
  const router = useRouter();

  const cancelHandler = () => {
    setLobbyId(null);
    router.push("/lobby");
  };

  const checkPassword = useCallback(
    async (password: string): Promise<Lobby | null> => {
      const lobby: Lobby | null = await firebaseService.getDocByQuery<Lobby>(
        CollectionName.LOBBIES,
        "code",
        password.toLocaleUpperCase()
      );

      console.log(lobby?.members.length);
      console.log(lobby?.maxPlayers);
      if (lobby && lobby.members.length < lobby.maxPlayers) {
        setIncorrectPassword(false);
        setLobbyId(lobby.id);
        console.log(lobbyId);
        return lobby;
      }

      setIncorrectPassword(true);
      setLobbyId("");
      return null;
    },
    [setLobbyId]
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const lobby: Lobby | null = await checkPassword(values.code);
      return lobby;
    },
    [checkPassword]
  );

  const { values, errors, touched, handleSubmit, handleChange } =
    useFormik<FormValues>({
      initialValues,
      validationSchema,
      onSubmit,
    });

  useEffect(() => {
    setLobbyId("");
  }, []);

  return (
    <div className="body">
      <div className={`card ${styles.card}`}>
        <div className={styles.title}>ENTER CODE</div>
        <div className={styles.form_container}>
          <div className={styles.pacman}></div>
          <form className={styles.form} action="submit" onSubmit={handleSubmit}>
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

            {!lobbyId && (
              <Button
                cKBtn={true}
                btnText={"ENTER"}
                className={`${styles.btn} continue`}
                type="submit"
              />
            )}
          </form>
        </div>
        <div className={styles.card_footer}>
          {incorrectPassword && (
            <div className={styles.errorMessage}>
              Lobby Not Found
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <div className={styles.pacman_sprite}>
                  <PacmanSprite
                    state={0}
                    velocity={0.9}
                    scale={1.2}
                    rotation={180}
                  />
                </div>

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
            <div className={styles.join_btn_container}>
              <Link href={"/username"}>
                <Button btnText="JOIN" cKBtn className={`continue`} />
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className={styles.cancel_container}>
        <Button
          cKBtn={true}
          btnText={"BACK"}
          className={`${styles.btn} cancel`}
          onClick={() => cancelHandler()}
        />
      </div>
    </div>
  );
}
