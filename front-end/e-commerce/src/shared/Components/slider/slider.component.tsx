import { FC } from "react";
import { useStyles } from "./slider.style";
import { Slider as CKSlider,SliderTrack,SliderFilledTrack,SliderThumb, SliderMark, Box, Card} from "@chakra-ui/react";
import { SliderProps } from "../../../types";
import { maxValue } from "../../../data";


export const Slider: FC<SliderProps>= (props) => {



  const classes = useStyles()

  return (
    <Card className={classes.sliderCard}>
      <p className={classes.sliderTitle}>{props.sliderTitle}</p>
      <CKSlider aria-label="slider-ex-1" margin={"10px"} colorScheme="red" min={props.minValue} max={props.maxValue} defaultValue={maxValue.productPrice} step={props.step} onChange={(value) => props.setSliceValue(value)}>
        <SliderMark className={classes.labelStyle} value={props.minValue} >
          ${String(props.minValue)}
        </SliderMark>
        <SliderMark className={classes.markStyle} value={props.sliderValue!}>
          ${props.sliderValue}
        </SliderMark>
        <SliderMark className={classes.labelStyle} value={props.maxValue}>
          ${props.maxValue}
        </SliderMark>
        <SliderTrack bg={"red.100"}>
          <SliderFilledTrack />
        </SliderTrack>
      <SliderThumb boxSize={"15px"}>
          <Box color={"tomato"} as={props.markIcon} />
      </SliderThumb>
    </CKSlider>
    </Card>
  );
};
