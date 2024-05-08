import React, { useEffect, useState } from "react";
import { expenseApi } from "../../api";
import { useLocation, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import moment from "moment";
import AddExpenses from "../Group/AddExpenses";
import SettleUpPayment from "./settleUpPayment";

const ListGroupExpenses = () => {
  const location = useLocation();
  const { groupMembers } = location.state || {};
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openSettleUpPopup, setSettleUpOpenPopup] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await expenseApi.getExpenseGroup(groupId);
        setExpenses(response.data);
      } catch (err) {
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [groupId, openPopup, openSettleUpPopup]);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleSettleUpOpenPopup = () => {
    setSettleUpOpenPopup(true);
  };

  const handleSettleUpClosePopup = () => {
    setSettleUpOpenPopup(false);
  };

  return (
    <>
      <AddExpenses
        open={openPopup}
        groupMembers={groupMembers}
        groupId={groupId}
        onClose={handleClosePopup}
      />
      <SettleUpPayment
        open={openSettleUpPopup}
        groupMembers={groupMembers}
        groupId={groupId}
        onClose={handleSettleUpClosePopup}
      />
      <Button
        style={{ float: "right", margin: "10px" }}
        variant="contained"
        onClick={handleOpenPopup}
      >
        Add Expense
      </Button>
      <Button
        style={{ float: "right", margin: "10px" }}
        variant="contained"
        onClick={handleSettleUpOpenPopup}
      >
        Settle Up
      </Button>

      <TableContainer component={Paper}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>No expenses to show</div>
        ) : (
          <Table aria-label="group-expenses-table">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Expense Type</TableCell>
                <TableCell>Split Type</TableCell>
                <TableCell>Payee</TableCell>
                <TableCell>Included Persons</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.expenseId}>
                  <TableCell>{expense.description || "No Description"}</TableCell>
                  <TableCell>
                    {expense.expenseType === "record" ? "Settlement Payment" : "Expense"}
                  </TableCell>
                  <TableCell>{expense.splitType}</TableCell>
                  <TableCell>
                    {expense.payee.firstName} {expense.payee.lastName}
                  </TableCell>
                  <TableCell>
                    {expense.subExpenses.map((subExpense) => (
                      <Typography key={subExpense.subExpenseId}>
                        {subExpense.firstName} {subExpense.lastName}: ₹
                        {subExpense.amount.toFixed(2)}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    {moment(expense.expenseDate).format("DD/MM/YYYY")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};

export default ListGroupExpenses;
