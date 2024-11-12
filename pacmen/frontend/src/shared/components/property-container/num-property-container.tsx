import { FC } from "react";

import { Button } from "../button";

import { NumPropertyContainerProps } from "@/shared/types";

import styles from "./property-container.module.css";

export const NumPropertyContainer: FC<NumPropertyContainerProps> = ({
  propertyTitle,
  propertyTop,
  propertyBottom,
  propertyValue,
  step = 1,
  setProperty,
  className,
}) => {
  const stepDirection: { [key: string]: number } = {
    up: 1,
    down: -1,
  };

  const modifyProperty = (direction: "up" | "down") => {
    let nextValue = propertyValue + stepDirection[direction] * step;

    nextValue =
      nextValue > propertyTop
        ? propertyTop
        : nextValue < propertyBottom
        ? propertyBottom
        : nextValue;

    setProperty(nextValue);
  };

  return (
    <div className={`${styles.property_container} ${className}`}>
      <p className={styles.property_title}>{propertyTitle}</p>
      <div className={styles.property_btns_container}>
        <Button
          btnText=" - "
          cKBtn={false}
          className={styles.property_btn}
          type="button"
          onClick={() => modifyProperty("down")}
        />
        <p className={`${styles.property_title} ${styles.property_value}`}>
          {propertyValue}
        </p>
        <Button
          btnText=" + "
          cKBtn={false}
          className={styles.property_btn}
          type="button"
          onClick={() => modifyProperty("up")}
        />
      </div>
    </div>
  );
};
