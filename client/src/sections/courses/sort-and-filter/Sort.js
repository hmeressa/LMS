import KeyboardDoubleArrowDownTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowDownTwoTone";
import KeyboardDoubleArrowUpTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowUpTwoTone";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

export default function Sort({ enabled, sortOrder, setSortOrder }) {
  const handleClick = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography color="action.active">Sort</Typography>
      <List>
        <ListItemButton
          disabled={!enabled}
          selected={true}
          onClick={handleClick}
          sx={{
            borderRadius: "10px",
          }}>
          <ListItemText>Sort by title</ListItemText>
          <ListItemIcon sx={{ minWidth: "fit-content" }}>
            {sortOrder === "asc" ? (
              <KeyboardDoubleArrowUpTwoToneIcon />
            ) : (
              <KeyboardDoubleArrowDownTwoToneIcon />
            )}
          </ListItemIcon>
        </ListItemButton>
      </List>
    </Box>
  );
}
