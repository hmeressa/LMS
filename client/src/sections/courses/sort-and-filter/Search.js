import { Box, TextField } from "@mui/material";

export default function Search({ enabled, setQuery }) {
  return (
    <Box>
      <TextField
        disabled={!enabled}
        type="search"
        fullWidth
        placeholder="Search"
        variant="standard"
        onChange={(e) => setQuery(e.target.value)}
      />
    </Box>
  );
}
