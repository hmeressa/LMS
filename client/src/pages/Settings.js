import { Box, Tooltip } from "@mui/material";
import { useContext } from "react";
import { authContext } from "../App";
import Header from "../components/header/MainPagesHeader";
import AppearanceSettings from "../sections/settings/AppearanceSettings";
import ProfileImage from "../sections/settings/ProfileImageSettings";
import ProfileSettings from "../sections/settings/ProfileSettings";

export default function Settings() {
  const { user } = useContext(authContext);
  const canEdit = user && user.role.permissions.settings.edit;

  return (
    <>
      <Header title="Settings" />
      <Tooltip
        placement="top-start"
        title={
          canEdit ? "" : "The admin restricted you from editing your info"
        }>
        <Box
          disabled
          sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}>
          <ProfileImage canEdit={canEdit} />
          <ProfileSettings canEdit={canEdit} />
          <AppearanceSettings canEdit={canEdit} />
        </Box>
      </Tooltip>
    </>
  );
}
