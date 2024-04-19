import styled from "@emotion/styled";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

export const StyledAccordion = styled((props) => (
  <Accordion disableGutters elevation={0} {...props} sx={{ padding: 0 }} />
))(({ theme }) => ({}));

export const StyledAccordionSummary = styled((props) => (
  <AccordionSummary
    expandIcon={<ExpandMoreTwoToneIcon />}
    {...props}
    sx={{ padding: 0 }}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
}));

export const StyledAccordionDetails = styled((props) => (
  <AccordionDetails {...props} sx={{ padding: 0 }} />
))(({ theme }) => ({}));
