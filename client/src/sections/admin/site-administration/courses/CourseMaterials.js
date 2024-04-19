import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import CustomSnackbar from "../../../../components/alerts/CustomSnackbar";
import EmptyState from "../../../../components/empty-state/EmptyState";
import CourseFiles from "./CourseFiles";

export default function CourseMaterials({ title, activeTreeItem }) {
  const [materials, setMaterials] = useState();
  const { user } = useContext(authContext);
  const [notification, setNotification] = useState({});

  const getMaterials = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/coursematerial/findManyByCourseTitle/${title}`
      );

      if (response.status === 200) {
        setMaterials(response.data);
        console.log("material", response.data);
      }
    } catch (e) {}
  };

  const courseMaterialDone = async (courseMaterialId) => {
    try {
      const response = await axiosInstance.post(
        `${
          process.env.REACT_APP_API_URL
        }/materialEnrollment/doneWithoutRegister/${courseMaterialId}/${
          user && user.email
        }`
      );

      if (response.status === 201) {
        notification.message = "Success";
        notification.severity = "success";
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK" || !e.response) {
        notification.message =
          "Network error. Check your internet connection and try again.";
        notification.severity = "error";
      } else {
        notification.message = e.response.data.message;
        notification.severity = "error";
      }
    }

    setNotification(notification);
  };

  useEffect(() => {
    getMaterials();
  }, []);

  return (
    <>
      {notification.message && (
        <CustomSnackbar
          notification={notification}
          setNotification={setNotification}
        />
      )}

      <Box>
        {materials && materials.length >= 1 ? (
          <Stack spacing={2}>
            {materials.map((material) => {
              return (
                <Card key={material.id} sx={{ position: "relative" }}>
                  <Card>
                    <CardHeader
                      title={material.title}
                      subheader={material.body}
                    />
                    <CardContent>
                      {material.files.length >= 1 &&
                        material.files.map((file) => {
                          return (
                            <CourseFiles
                              key={file.id}
                              file={file}
                              activeTreeItem={activeTreeItem}
                            />
                          );
                        })}
                      <Box sx={{ mt: 2 }}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            courseMaterialDone(material.id);
                          }}
                        >
                          Mark as done
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <EmptyState text="There are no course materials associated with this course." />
        )}
      </Box>
    </>
  );
}
