import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header({
  title,
  setQuery,
  placeholder,
  setOpen,
  to,
  canAdd,
}) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        <Typography variant="h4">{title}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "normal",
          gap: 2,
        }}>
        <TextField
          size="small"
          type="search"
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        {canAdd && (setOpen || to) ? (
          <Button
            startIcon={<AddTwoToneIcon />}
            variant="contained"
            onClick={() =>
              setOpen ? setOpen(true) : navigate(to)
            }>{`Add new`}</Button>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
