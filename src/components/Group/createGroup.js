import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import "./createGroup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { groupApi, userApi } from "../../api";
import { useNavigate } from "react-router-dom";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const defaultTheme = createTheme();

const CreateGroup = () => {
  const navigate = useNavigate();
  const [personName, setPersonName] = useState([]);
  const [names, setNames] = useState([]);
  useEffect(() => {
    userApi
      .getUsersList()
      .then((res) => {
        console.log("res", res);
        console.log("res", res.data);
        setNames(res.data);
      })
      .catch((err) => {
        console.log("err", err?.response?.data?.message);
      });
  }, []);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // When `value` is an array, it represents the new state of selected IDs
    setSelectedIds(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };
  const renderSelectedNames = (selected) => {
    // Convert the list of IDs into corresponding full names for display
    return selected
      .map((id) => {
        const person = names.find((item) => item.userId === id);
        return person ? `${person.firstName} ${person.lastName}` : null;
      })
      .filter((name) => name !== null)
      .join(", ");
  };
  const handleSubmit = (event, variant) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    // const groupName = data.get("groupName");
    // if (!groupName) {
    //   console.error("Both group name is required.");
    // }
    // console.log("groupName", groupName,personName);

    const obj = {
      groupName: data.get("groupName"),
      groupMembers: selectedIds,
    };

    groupApi
      .createGroup(obj)
      .then((res) => {
        console.log(
          "Group created successfully:",
          res?.message || "No message"
        );
        setTimeout(() => {
          navigate("/groupList");
        }, 500);
      })
      .catch((err) => {
        console.error(
          "Error creating group:",
          err?.response?.data?.message || "Unknown error"
        );
      });
    console.log("data", obj);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: -18,
          }}
        >
          <Box>
            <Avatar
              className="groupIcon"
              sx={{ m: 1, bgcolor: "transparent", color: "black" }}
            >
              <GroupAddIcon sx={{ fontSize: 100 }} />
            </Avatar>
          </Box>
          <Box
            onSubmit={handleSubmit}
            component="form"
            sx={{
              // marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "300px",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ marginLeft: 1 }}>
              START A NEW GROUP
            </Typography>
            <TextField
              sx={{ marginTop: 2 }}
              margin="normal"
              fullWidth
              id="groupName"
              label="Enter Group Name"
              name="groupName"
              autoComplete="groupName"
              autoFocus
            />
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Select Member
              </InputLabel>
              <Select
                labelId="multi-select-label"
                id="multi-select"
                multiple
                value={selectedIds}
                onChange={handleChange}
                input={<OutlinedInput label="Select Member" />}
                renderValue={renderSelectedNames}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name.userId} value={name.userId}>
                    <Checkbox checked={selectedIds.indexOf(name.userId) > -1} />
                    <ListItemText
                      primary={`${name.firstName} ${name.lastName}`}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
              {/* <Link
                style={{ color: "white", textDecoration: "none" }}
                // to="/groupList"
              > */}
              Save
              {/* </Link> */}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CreateGroup;
