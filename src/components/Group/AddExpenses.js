import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@material-ui/core";
import PropTypes from "prop-types";
import "./createGroup.css";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Avatar from "@mui/material/Avatar";
import "./createGroup.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { expenseApi } from "../../api";

const groupList = [
  {
    groupId: 13,
    groupName: "new group",
    members: [
      {
        memberId: 2,
        firstName: "Reyansh",
        lastName: "Joshi",
      },
      {
        memberId: 3,
        firstName: "Amit",
        lastName: "Jaiswal",
      },
      {
        memberId: 1,
        firstName: "john",
        lastName: "Doe",
      },
    ],
  },
  {
    groupId: 15,
    groupName: "second group",
    members: [
      {
        memberId: 2,
        firstName: "Reyansh",
        lastName: "Joshi",
      },
      {
        memberId: 4,
        firstName: "Adhitesh",
        lastName: "Chouhan",
      },
      {
        memberId: 1,
        firstName: "john",
        lastName: "Doe",
      },
    ],
  },
];

const AddExpenses = ({ open, onClose, groupMembers, groupId }) => {
  const userDataString = localStorage.getItem("userData");
  let userId = null;

  if (userDataString) {
    const userData = JSON.parse(userDataString);
    userId = userData.userId;
  }
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

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [group, setGroup] = useState("");
  const [sharedBy, setSharedBy] = useState([]);
  const [sharedAmount, setSharedAmount] = useState(0);

  const handleClose = () => {
    onClose();
  };
  const handleSave = () => {
    try {
      let finalPayload = {
        description: description,
        amount: amount,
        payeeId: userId,
        groupId: groupId,
        splitType: "equally",
        sharedBy: sharedBy,
      };
  
      if (date) {
        finalPayload.expenseDate = date;
      }
      console.log("first", finalPayload);
      expenseApi
        .addExpense(finalPayload)
        .then((response) => {
          console.log("response", response?.message);
        })
        .catch((err) => {
          console.log("error", err?.response?.data?.message);
        });
    } catch (err) {
      console.log("error", err);
    } finally {
      onClose();
    }
  };

  const getUserIds = (sharedBy) => sharedBy?.map((item) => item?.userId);
  const handleChange = (event) => {
    const { value } = event.target;
    let updatedSharedBy = [...sharedBy];

    groupMembers.forEach((member) => {
      if (
        value.includes(member.memberId) &&
        !getUserIds(updatedSharedBy).includes(member.memberId)
      ) {
        updatedSharedBy.push({ userId: member.memberId, amount: 0 });
      } else if (!value.includes(member.memberId)) {
        updatedSharedBy = updatedSharedBy.filter(
          (item) => item.userId !== member.memberId
        );
      }
    });

    setSharedBy(updatedSharedBy);

    const updatedSharedAmount =
      updatedSharedBy.length > 0
        ? (amount / updatedSharedBy.length).toFixed(2)
        : 0;

    updatedSharedBy.forEach((item) => {
      item.amount = parseFloat(updatedSharedAmount);
    });

    setSharedAmount(updatedSharedAmount);
  };

  const getDisplayNames = (selectedUserIds) => {
    return groupMembers
      .filter((member) => selectedUserIds.includes(member.memberId))
      .map((member) => `${member.firstName} ${member.lastName}`)
      .join(", ");
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add an expense</DialogTitle>
        <DialogContent>
          <Box style={{ display: "flex" }}>
            <Avatar
              className="noteIcon"
              sx={{ m: 1, bgcolor: "transparent", color: "black" }}
            >
              <NoteAddIcon sx={{ fontSize: 100 }} />
            </Avatar>
            <Box>
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Enter Description"
                type="text"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Box>
          </Box>

          <Box style={{ textAlign: "center", marginTop: "10px" }}>
            <DialogContentText>
              Paid by <span style={{ color: "#1976d2" }}>you</span> and split
              equally​. (₹{sharedAmount}/person)
            </DialogContentText>
          </Box>

          <Box sx={{ display: "flex", gap: "10px" }}>
            <TextField
              margin="dense"
              id="date"
              label="Date"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth style={{ marginTop: "5px" }}>
              <InputLabel id="group-label">Split Type</InputLabel>
              <Select
                labelId="group-label"
                id="group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                <MenuItem key={1} value={"equally"}>
                  Equally
                </MenuItem>
                <MenuItem key={1} value={"unEqually"}>
                  Un Equally
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            Select included members
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              name="groupMembers"
              multiple
              value={getUserIds(sharedBy)} 
              onChange={handleChange}
              input={<OutlinedInput label="Select Member" />}
              renderValue={(selected) => getDisplayNames(selected)} 
            >
              {groupMembers.map((member) => (
                <MenuItem key={member.memberId} value={member.memberId}>
                  <Checkbox
                    checked={getUserIds(sharedBy).includes(member.memberId)}
                  />
                  <ListItemText
                    primary={`${member.firstName} ${member.lastName}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddExpenses;

AddExpenses.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
