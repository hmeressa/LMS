import { Box, Typography } from "@mui/material";

export default function EmptyState({ text }) {
  return (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
}
