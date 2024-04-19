import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../api";
import Header from "../components/header/MainPagesHeader";
import ProgressSummaryCard from "../sections/dashboard/ProgressCard";
import RecentlyAccessedAdmin from "../sections/dashboard/RecentlyAccessedAdmin";

export default function AdminDashboard() {
  const [inProgress, setInProgress] = useState();
  const [done, setDone] = useState();
  const [inProgressFetchError, setInProgressFetchError] = useState();
  const [doneFetchError, setDoneFetchError] = useState();
  const theme = useTheme();

  const getInProgress = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/courseEnrollment/findAllProgress`
      );

      if (response.status === 200) {
        setInProgress(response.data);
      }
    } catch (e) {
      setInProgressFetchError("true");
    }
  };

  const getDone = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/courseEnrollment/findAllDone`
      );

      if (response.status === 200) {
        setDone(response.data);
      }
    } catch (e) {
      setDoneFetchError("true");
    }
  };

  useEffect(() => {
    getInProgress();
    getDone();
  }, []);

  return (
    <>
      <Header title="Admin Dashboard" />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          mb: 2,
          flexGrow: 1,
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
          },
        }}>
        <ProgressSummaryCard
          icon={<HourglassTopTwoToneIcon fontSize="large" />}
          value={inProgress && inProgress.length}
          title="Courses in progress from all users"
          color="info"
          error={inProgressFetchError}
        />
        <ProgressSummaryCard
          icon={<DoneAllTwoToneIcon fontSize="large" />}
          value={done && done.length}
          title="Finished courses from all users"
          color="success"
          error={doneFetchError}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          mb: 2,
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
          },
          flexGrow: 1,
        }}>
        <Box
          sx={{
            width: "50%",
            [theme.breakpoints.down("lg")]: {
              width: "100%",
            },
          }}>
          <RecentlyAccessedAdmin />
        </Box>
      </Box>
    </>
  );
}
