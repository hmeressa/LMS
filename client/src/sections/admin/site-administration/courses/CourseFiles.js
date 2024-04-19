import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../../api";

export default function CourseFiles({ file, activeTreeItem }) {
  const [actualFile, setActualFile] = useState();
  const [open, setOpen] = useState(false);
  const [chipColor, setChipColor] = useState("default");
  const [fileSize, setFileSize] = useState("");

  const activeElementRef = useRef(null);

  useEffect(() => {
    console.log(activeTreeItem, file.id);
    if (activeElementRef.current) {
      activeElementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeElementRef]);

  useEffect(() => {
    const fileType = file.mimetype.split("/")[0];

    // Set the chip color based on the file type
    if (fileType === "video") {
      setChipColor("error");
    } else if (fileType === "image") {
      setChipColor("info");
    } else if (fileType === "application") {
      setChipColor("success");
    } else if (fileType === "audio") {
      setChipColor("warning");
    } else {
      setChipColor("default");
    }

    let fileSizeKB = file.size / 1024;

    if (fileSizeKB < 1024) {
      setFileSize(fileSizeKB.toFixed(2) + " KB");
    } else {
      setFileSize((fileSizeKB / 1024).toFixed(2) + " MB");
    }

    if (fileSizeKB >= 1024) {
      setFileSize((fileSizeKB / 1024).toFixed(2) + " MB");
      if (fileSizeKB / 1024 >= 1024) {
        setFileSize((fileSizeKB / 1024 / 1024).toFixed(2) + " GB");
      }
    }
  }, [file.mimetype, file.size]);

  const getFile = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/coursematerial/findOneFileById/${file.id}`,
        {
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const fileBlob = new Blob([response.data]);
        setActualFile(fileBlob);
        setOpen(true);
      }
    } catch (e) {}
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/coursematerial/downloadFileById/${file.id}`,
        {
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const fileBlob = new Blob([response.data]);
        const downloadUrl = URL.createObjectURL(fileBlob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = file.originalname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error("Error downloading file:", e);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fileType = file.mimetype.split("/")[0];

  return (
    <Box>
      <Box
        ref={activeTreeItem === file.id ? activeElementRef : null}
        sx={{
          cursor: "pointer",
          display: "flex",
          gap: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderBottomColor: "action.selected",
          py: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography onClick={getFile} variant="body1" color="text.primary">
            {file.originalname.split(".")[0]}
          </Typography>
          <Chip
            label={fileType.charAt(0).toUpperCase() + fileType.slice(1)}
            size="small"
            color={chipColor}
          />
        </Box>

        <Box sx={{ zIndex: 999 }}>
          <Button onClick={handleDownload} startIcon={<DownloadTwoToneIcon />}>
            <Typography fontSize="small">{fileSize}</Typography>
          </Button>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{file.originalname}</DialogTitle>
        <DialogContent>
          {fileType === "video" && actualFile && (
            <video controls style={{ maxWidth: "100%" }}>
              <source src={URL.createObjectURL(actualFile)} type="video/mp4" />
              <source src={URL.createObjectURL(actualFile)} type="video/webm" />
            </video>
          )}
          {fileType === "image" && actualFile && (
            <img
              src={URL.createObjectURL(actualFile)}
              alt={file.originalname}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
          {fileType === "application" ||
            (fileType === "text" && actualFile && (
              <a href={URL.createObjectURL(actualFile)} download>
                Download File
              </a>
            ))}
          {fileType === "audio" && actualFile && (
            <audio controls style={{ width: "100%" }}>
              <source src={URL.createObjectURL(actualFile)} type="audio/mp3" />
              <source src={URL.createObjectURL(actualFile)} type="audio/mpeg" />
              <source src={URL.createObjectURL(actualFile)} type="audio/wav" />
            </audio>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
