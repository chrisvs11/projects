import { FC } from "react";

import { Button } from "../button";

import { ListPropertyContainerProps } from "@/shared/types";

import styles from "./property-container.module.css";

export const ListPropertyContainer: FC<ListPropertyContainerProps> = ({
  propertyTitle,
  optionList,
  optionValue,
  setListValue,
  id,
}) => {
  const moveThroughOptions = () => {
    const listLength = optionList.length;

    const currentIndex = optionList.findIndex(
      (option) => option === optionValue
    );

    let nextIndex = (currentIndex + 1) % listLength;

    setListValue(nextIndex);
  };

  return (
    <div className={styles.property_container} id={id}>
      <p className={styles.property_title}>{propertyTitle}</p>
      <div className={styles.property_btns_container}>
        <Button
          cKBtn={true}
          btnText={optionValue}
          className={styles.btn}
          onClick={() => moveThroughOptions()}
        />
      </div>
    </div>
  );
};
