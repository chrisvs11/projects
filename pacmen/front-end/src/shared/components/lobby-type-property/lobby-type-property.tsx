// import { FC, SetStateAction } from "react";
// import { PropertyContainer } from "../property-container";
// import { LobbyType } from "@/shared/types";

// interface LobbyTypePropertyProps {
//   lobbyType: string;
//   setLobbyType: (value: SetStateAction<LobbyType>) => void;
// }

// export const LobbyTypeProperty: FC<LobbyTypePropertyProps> = ({
//   lobbyType,
//   setLobbyType,
// }) => {
//   const togglePublicButton = () => {
//     console.log("lobby Type", lobbyType);
//     console.log(lobbyType === LobbyType.PRIVATE);

//     if (lobbyType === LobbyType.PRIVATE) {
//       setLobbyType(LobbyType.PUBLIC);
//     } else {
//       setLobbyType(LobbyType.PRIVATE);
//     }
//   };

//   return (
//     <PropertyContainer
//       propertyTitle={"Select Lobby Type: "}
//       propertyValue={lobbyType}
//       toggleProperty={togglePublicButton}
//       toggle
//     />
//   );
// };
