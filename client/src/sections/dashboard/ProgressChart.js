import { useTheme } from "@emotion/react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { authContext } from "../../App";
import axiosInstance from "../../api";

export default function ProgressChart() {
  const [courseProgress, setCourseProgress] = useState();
  const { user } = useContext(authContext);
  const theme = useTheme();

  useEffect(() => {
    const getInProgress = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/courseEnrollment/findManyByEmail/${
            user && user.email
          }`
        );

        if (response.status === 200) {
          setCourseProgress(response.data);
        }
      } catch (e) {}
    };

    getInProgress();
  }, []);

  return (
    <Card
      sx={{
        width: "50%",
        [theme.breakpoints.down("lg")]: {
          width: "100%",
        },
      }}>
      <CardHeader title="Course Progress" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={courseProgress}
            layout="vertical"
            barGap={0}
            barCategoryGap={0}
            barSize={5}>
            <XAxis type="number" padding={{ left: 0, right: 0 }} />
            <YAxis
              dataKey="course.title"
              type="category"
              padding={{ left: 0, right: 0 }}
            />
            <Tooltip />
            <Bar dataKey="progress" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
