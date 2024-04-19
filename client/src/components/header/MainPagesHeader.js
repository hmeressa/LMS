import { Box, Typography } from "@mui/material";

export default function MainPagesHeaderHeader({ title }) {
  return (
    <Box
      sx={{
        mb: 4,
        borderBottom: "1px solid",
        borderBottomColor: "action.selected",
      }}>
      <Typography gutterBottom variant="h4">
        {title}
      </Typography>
    </Box>
  );
}
