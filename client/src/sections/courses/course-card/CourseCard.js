import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../../App";
import axiosInstance from "../../../api";
export default function CourseCard({ course }) {
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
      onClick={() => handleClick(course.id)}>
      <CardMedia>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            backgroundColor: 'action.selected',
          }}>
          <Typography variant="h3">{course.title[0].toUpperCase()}</Typography>
        </Box>
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" sx={{ fontWeight: "bold" }}>
          {course.title}
        </Typography>
        {course.category && (
          <Chip label={course.category.categoryName} size="small" />
        )}

        <Typography variant="body2">{course.description}</Typography>
      </CardContent>
    </Card>
  );
}
