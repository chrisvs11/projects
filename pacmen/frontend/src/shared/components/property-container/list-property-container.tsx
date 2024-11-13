import { FC } from "react";

import { Button } from "../buttons";

import { ListPropertyContainerProps } from "@/shared/types";

import styles from "./property-container.module.css";

export const ListPropertyContainer: FC<ListPropertyContainerProps> = ({
  propertyTitle,
  optionList,
  optionValue,
  setListValue,
  id,
  className,
}) => {
  const moveThroughOptions = () => {
    const listLength = optionList.length;

    const currentIndex = optionList.findIndex(
      (option) => option === optionValue
    );

    const nextIndex = (currentIndex + 1) % listLength;

    setListValue(nextIndex);
  };

  return (
    <div className={`${styles.property_container} ${className}`} id={id}>
      <p className={styles.property_title}>{propertyTitle}</p>
      <div className={styles.property_btns_container}>
        <Button
          cKBtn={true}
          btnText={optionValue}
          className={`${styles.btn} ${optionValue}`}
          onClick={() => moveThroughOptions()}
        />
      </div>
    </div>
  );
};
