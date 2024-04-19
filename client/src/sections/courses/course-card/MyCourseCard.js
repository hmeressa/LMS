import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../../App";
import axiosInstance from "../../../api";

export default function MyCourseCard({ enrollment }) {
  const navigate = useNavigate();
  const { user } = useContext(authContext);

  const catchRecentAccess = async (courseId, email) => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/recentlyAccessedCourse/register/${courseId}/${email}`
      );
    } catch (e) {}
  };

  const handleClick = (id) => {
    catchRecentAccess(id, user.email);
    navigate(`/courses/${id}`);
  };

  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          cursor: "pointer",
          boxShadow: 5,
          scale: "1.01",
        },
      }}
      onClick={() => handleClick(enrollment.courseId)}>
      <CardMedia>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            backgroundColor: "action.selected",
          }}>
          <Typography variant="h3">
            {enrollment.course.title[0].toUpperCase()}
          </Typography>
        </Box>
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" sx={{ fontWeight: "bold" }}>
          {enrollment.course.title}
        </Typography>
        <Typography variant="body2">{enrollment.course.description}</Typography>
      </CardContent>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          px: 1,
          borderBottomLeftRadius: 3,
          backgroundColor: (theme) => theme.palette.primary.main,
        }}>
        {`${enrollment.progress || 0}%`}
      </Box>
    </Card>
  );
}
