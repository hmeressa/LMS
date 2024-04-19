import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import { Box, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../App";
import axiosInstance from "../api";
import Header from "../components/header/MainPagesHeader";
import ProgressSummaryCard from "../sections/dashboard/ProgressCard";
import ProgressChart from "../sections/dashboard/ProgressChart";
import RecentlyAccessed from "../sections/dashboard/RecentlyAccessedUser";

export default function Dashboard() {
  const [inProgress, setInProgress] = useState();
  const [done, setDone] = useState();
  const [fetchError, setFetchError] = useState();
  const theme = useTheme();
  const { user } = useContext(authContext);

  const getAll = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/courseEnrollment/findManyByEmail/${
          user && user.email
        }`
      );

      if (response.status === 200) {
        const progress = response.data.filter(
          (course) => course.status !== "COMPLETED"
        );
        const done = response.data.filter(
          (course) => course.status === "COMPLETED"
        );
        setInProgress(progress);
        setDone(done);
      }
    } catch (e) {
      setFetchError("true");
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <>
      <Header title="Dashboard" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          mb: 2,
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
          },
        }}>
        <ProgressSummaryCard
          icon={<HourglassTopTwoToneIcon fontSize="large" />}
          value={inProgress && inProgress.length}
          title="Courses in progress"
          color="info"
          error={fetchError}
        />
        <ProgressSummaryCard
          icon={<DoneAllTwoToneIcon fontSize="large" />}
          value={done && done.length}
          title="Finished courses"
          color="success"
          error={fetchError}
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
        }}>
        <ProgressChart />
        <Box
          sx={{
            width: "50%",
            [theme.breakpoints.down("lg")]: {
              width: "100%",
            },
          }}>
          <RecentlyAccessed />
        </Box>
      </Box>
    </>
  );
}
