import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
} from "@mui/material";

export default function Filter({ enabled, filterProps, change }) {
  // const [checked, setChecked] = useState([...filterProps]);

  const handleTopLevelChange = (e) => {
    change([e.target.checked, e.target.checked]);
  };

  const handleChange1 = (e) => {
    change([e.target.checked, filterProps[1]]);
  };

  const handleChange2 = (e) => {
    change([filterProps[0], e.target.checked]);
  };

  const error = filterProps.filter((v) => v).length === 0;

  const children = (
    <Box sx={{ ml: 3, display: "flex", flexDirection: "column" }}>
      <FormControlLabel
        label="In progress"
        control={
          <Checkbox
            disabled={!enabled}
            checked={filterProps[0]}
            onChange={handleChange1}
          />
        }
      />
      <FormControlLabel
        label="Done"
        control={
          <Checkbox
            disabled={!enabled}
            checked={filterProps[1]}
            onChange={handleChange2}
          />
        }
      />
      {error && (
        <FormHelperText error={error}>
          Select at least one option
        </FormHelperText>
      )}
    </Box>
  );

  return (
    <Box sx={{ my: 2 }}>
      <Typography color="action.active">Filter</Typography>
      <FormControlLabel
        label="All"
        control={
          <Checkbox
            disabled={!enabled}
            checked={filterProps[0] && filterProps[1]}
            indeterminate={filterProps[0] !== filterProps[1]}
            onChange={handleTopLevelChange}
          />
        }
      />
      {children}
    </Box>
  );
}
