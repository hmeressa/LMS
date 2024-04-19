import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function ChapterCard({ completed }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{ position: "relative" }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Chapter 1
        </Typography>
        <Typography variant="h5" component="div">
          Day 1
        </Typography>
      </CardContent>
      <Collapse in={expanded}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "roe",
              flexWrap: "wrap",
              gap: 1,
            }}>
            <Chip label="key concept" />
            <Chip label="key concept" />
            <Chip label="key concept" />
            <Chip label="key concept" />
            <Chip label="key concept" />
            <Chip label="key concept" />
            <Chip label="key concept" />
            <Chip label="key concept" />
            <Chip label="key concept" />
            <Chip label="key concept" />
          </Box>
        </CardContent>
      </Collapse>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          px: 1,
          borderBottomLeftRadius: 3,
          backgroundColor: (theme) =>
            completed
              ? theme.palette.primary.main
              : theme.palette.background.default,
        }}>
        {completed ? "Done" : "Mark as done"}
      </Box>
    </Card>
  );
}
