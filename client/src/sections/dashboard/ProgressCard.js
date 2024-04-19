import { Box, Card, CardContent, Typography, alpha } from "@mui/material";

export default function ProgressSummaryCard({
  icon,
  value,
  title,
  color,
  error,
  admin
}) {
  return (
    <Card
      sx={(theme) => ({
        background: alpha(theme.palette[color].main, 0.5),
        flexGrow: admin ? 0 : 1,
      })}>
      {
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          {icon}
          <Box sx={{ textAlign: "end" }}>
            <Typography variant="h3">{error ? <>NaN</> : value}</Typography>
            <Typography>{title}</Typography>
          </Box>
        </CardContent>
      }
    </Card>
  );
}
