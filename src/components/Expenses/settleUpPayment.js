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
} from "@mui/material";
import PropTypes from "prop-types";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Avatar from "@mui/material/Avatar";
import OutlinedInput from "@mui/material/OutlinedInput";
import { expenseApi } from "../../api";

const SettleUpPayment = ({ open, onClose, groupMembers, groupId }) => {
  const userDataString = localStorage.getItem("userData");
  let userId = null;

  if (userDataString) {
    const userData = JSON.parse(userDataString);
    userId = userData.userId;
  }
  const filteredGroupMembers = groupMembers.filter(
    (member) => member.memberId !== userId
  );
  const [amount, setAmount] = useState("");
  const [payee, setPayee] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    try {
      let finalPayload = {
        amount: parseFloat(amount).toFixed(2),
        payeeId: userId,
        groupId,
        sharedBy: [
          {
            userId: payee,
            amount: parseFloat(amount).toFixed(2),
          },
        ],
      };
      expenseApi
        .settleUpExpense(finalPayload)
        .then((response) => {
          console.log("response", response.message);
        })
        .catch((err) => {
          console.log("error", err.response?.data?.message);
        });
    } catch (err) {
      console.log("error", err);
    } finally {
      onClose();
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Settle Up</DialogTitle>
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
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </Box>
          </Box>

          <FormControl fullWidth style={{ marginTop: "10px" }}>
            {/* <InputLabel id="payee-label">Select Friend</InputLabel> */}
            <Select
              labelId="payee-label"
              id="payee"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              input={<OutlinedInput label="Select Friend" />}
            >
              {filteredGroupMembers.map((member) => (
                <MenuItem key={member.memberId} value={member.memberId}>
                  {`${member.firstName} ${member.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DialogContentText style={{ textAlign: "center", marginTop: "20px" }}>
            You are settling with{" "}
            {payee
              ? groupMembers.find((m) => m.memberId === parseInt(payee))
                  .firstName
              : "a friend"}
            .
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Settle Up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

SettleUpPayment.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  groupMembers: PropTypes.array.isRequired,
  groupId: PropTypes.number.isRequired,
};

export default SettleUpPayment;
