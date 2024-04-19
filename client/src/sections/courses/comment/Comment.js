import { Avatar, Box, Typography } from "@mui/material";
import intlFormat from "date-fns/intlFormat";

export default function Comment({ comment, own }) {
  return (
    <Box
      sx={{
        width: "fit-content",
        maxWidth: "60%",
        alignSelf: () => (own ? "end" : "start"),
        display: "flex",
        flexDirection: "row",
        alignItems: "end",
        gap: 1,
      }}>
      {!own && <Avatar />}
      <Box
        sx={{
          width: "fit-content",
          px: 2,
          py: 1,
          backgroundColor: (theme) =>
            own ? theme.palette.primary.main : theme.palette.grey[700],
          borderRadius: () => (own ? "25px 25px 0 25px" : "25px 25px 25px 0"),
          display: "flex",
          flexDirection: "column",
          alignItems: () => (own ? "end" : "start"),
          gap: 1,
        }}>
        <Typography>{comment.body}</Typography>
        <Typography color="text.secondary">
          {intlFormat(Date.parse(comment.createdAt), {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Typography>
      </Box>
    </Box>
  );
}
