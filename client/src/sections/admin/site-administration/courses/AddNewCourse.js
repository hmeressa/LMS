import { useTheme } from "@emotion/react";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api";
import EmptyState from "../../../../components/empty-state/EmptyState";

export default function AddNewCourse() {
  const [categories, setCategories] = useState();
  const [addCourseSuccess, setAddCourseSuccess] = useState(false);
  const [courseTitle, setCourseTitle] = useState(null);
  const [courseDescription, setCourseDescription] = useState(null);
  const [courseCategory, setCourseCategory] = useState(null);
  const [error, setError] = useState();
  const [courseMaterials, setCourseMaterials] = useState();
  const [openAddMaterial, setOpenAddMaterial] = useState();
  const navigate = useNavigate();
  const [courseMaterialTitle, setCourseMaterialTitle] = useState();
  const [courseMaterialCreditHour, setCourseMaterialCreditHour] = useState();
  const [courseMaterialBody, setCourseMaterialBody] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const theme = useTheme();

  const getCategories = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/category/findAll`
      );

      if (response.status === 200) {
        const sorted = response.data.sort(
          (a, b) => a.categoryName.toLowerCase() > b.categoryName.toLowerCase()
        );
        setCategories(sorted);
      }
    } catch (e) {}
  };

  const getCourseMaterials = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/coursematerial/findManyByCourseTitle/${courseTitle}`
      );

      if (response.status === 200) {
        setCourseMaterials(response.data);
      }
    } catch (error) {}
  };

  const handleAddCourse = async () => {
    if (courseTitle === null) {
      setError("Course title cannot be empty");
      return;
    } else if (courseDescription === null) {
      setError("Course description cannot be empty");
      return;
    } else if (courseCategory === null) {
      setError("Course category cannot be empty");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/course/register`,
        {
          categoryName: courseCategory,
          title: courseTitle,
          description: courseDescription,
        }
      );

      console.log("add course", response);

      if (response.status === 201) {
        setAddCourseSuccess(true);
      }
    } catch (error) {
      if (error.response.status === 406) {
        setError(
          "There is already another course with the same name. Try again with a different name"
        );
      }
    }
  };

  const handleAddMaterial = async () => {
    if (courseMaterialTitle === null) {
      setError("The title cannot be empty");
      return;
    } else if (courseMaterialCreditHour === null) {
      setError("The credit hour cannot be empty");
      return;
    } else if (courseMaterialBody === null) {
      setError("The body cannot be empty");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/coursematerial/register/${courseTitle}`,
        {
          title: courseMaterialTitle,
          crhr: parseInt(courseMaterialCreditHour, 10),
          body: courseMaterialBody,
        }
      );

      if (response.status === 201) {
        getCourseMaterials();
        setOpenAddMaterial(false);
      }
    } catch (error) {}
  };

  const handleUploadFile = async (e, title) => {
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      console.log(e.target.files);

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/coursematerial/uploadFile/${title}/${e.target.files[0].name}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.status === 201) {
        getCourseMaterials();
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getCourseMaterials();
  }, [addCourseSuccess]);

  return (
    <>
      {/* add course */}
      {addCourseSuccess ? (
        <>
          <Card>
            <CardContent>
              <Typography>{courseCategory}</Typography>
              <Typography variant="h4">{courseTitle}</Typography>
              <Typography>{courseDescription}</Typography>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ my: 2, cursor: "pointer" }}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
              }}>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                onClick={() => setOpenAddMaterial(true)}>
                <AddTwoToneIcon /> Add course material
              </Box>
              {courseMaterials && courseMaterials.length >= 1 && (
                <Button variant="contained" onClick={() => navigate(-1)}>
                  Done
                </Button>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card
          sx={{
            maxWidth: "50vw",
            [theme.breakpoints.down("lg")]: { maxWidth: "100vw" },
          }}>
          <CardHeader subheader="Add a new course" />
          <CardContent
            sx={{ justifyContent: "center", alignItems: "center", mx: "auto" }}>
            <Box>
              {error && (
                <Alert sx={{ width: "100%" }} severity="error">
                  {error}
                </Alert>
              )}
            </Box>
            <Box
              sx={{
                mb: 2,
              }}>
              <Typography gutterBottom>Category</Typography>
              <Select
                fullWidth
                onChange={(e) => setCourseCategory(e.target.value)}>
                {categories && categories.length >= 1 ? (
                  categories.map((category) => {
                    return (
                      <MenuItem value={category.categoryName}>
                        {category.categoryName}
                      </MenuItem>
                    );
                  })
                ) : (
                  <EmptyState text="You need to add a category first" />
                )}
              </Select>
            </Box>
            <Box
              sx={{
                mb: 2,
              }}>
              <Typography gutterBottom>Title</Typography>
              <TextField
                fullWidth
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </Box>
            <Box>
              <Typography gutterBottom>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={handleAddCourse}>
              Add
            </Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </CardActions>
        </Card>
      )}

      {/* course materials */}
      {courseMaterials &&
        courseMaterials.map((material) => {
          return (
            <Card sx={{ my: 2 }}>
              <CardContent
                sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography fontSize="small">
                    Credit Hour: {material.crhr}
                  </Typography>
                  <Typography variant="h6">{material.title}</Typography>
                  <Typography>{material.body}</Typography>
                </Box>
                <Box>
                  <Button component="label">
                    Upload file
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        handleUploadFile(e, material.title);
                      }}
                    />
                  </Button>
                </Box>
              </CardContent>
              <CardContent>
                {material.files &&
                  material.files.map((file) => {
                    return <Box sx={{ my: 1 }}>{file.originalname}</Box>;
                  })}
              </CardContent>
            </Card>
          );
        })}

      {/* add course material dialog */}
      <Dialog open={openAddMaterial} onClose={() => setOpenAddMaterial(false)}>
        <DialogTitle>Add course material</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 2 }}>
            <Box width="70%">
              <Typography gutterBottom>Title</Typography>
              <TextField
                fullWidth
                type="text"
                onChange={(e) => setCourseMaterialTitle(e.target.value)}
              />
            </Box>
            <Box width="30%">
              <Typography gutterBottom>Credit Hour</Typography>
              <TextField
                type="number"
                onChange={(e) => setCourseMaterialCreditHour(e.target.value)}
              />
            </Box>
          </Box>
          <Box>
            <Typography gutterBottom>Body</Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              onChange={(e) => setCourseMaterialBody(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMaterial(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMaterial}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
