import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext } from "../../theme/ColorModeContext";

export default function AppearanceSettings({ canEdit }) {
  const colorMode = useContext(ColorModeContext);
  const [checked, setChecked] = useState(
    localStorage.getItem("theme") === "dark" ||
      localStorage.getItem("theme") === null
      ? true
      : false
  );

  const handleChange = (event) => {
    setChecked(!checked);
    colorMode.toggleColorMode();
  };

  return (
    <Card>
      <CardHeader subheader="Appearance" />
      <CardContent>
        <Typography>Theme</Typography>
        <FormControlLabel
          control={
            <Switch
              disabled={!canEdit}
              checked={checked}
              onChange={handleChange}
            />
          }
          label="Dark mode"
        />
      </CardContent>
    </Card>
  );
}
