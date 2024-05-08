import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AddExpenses from "./AddExpenses";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import { expenseApi, groupApi } from "../../api";

export default function ShowGroup() {
  const navigate = useNavigate();

  const [groupList, setGroupList] = useState([]);
  const [dashBordData, setDashBoardData] = useState([]);
  const userDataString = localStorage.getItem("userData");
  let userId = null;

  if (userDataString) {
    const userData = JSON.parse(userDataString);
    userId = userData.userId;
  }

  useEffect(() => {
    expenseApi
      .getDashboardData(userId)
      .then((res) => {
        console.log("res", res?.message || "No message");
        setDashBoardData(res?.data);
      })
      .catch((err) => {
        console.log("err", err?.response?.data?.message);
      });
    groupApi
      .getGroupList(userId)
      .then((res) => {
        console.log("res", res);
        setGroupList(res.data);
      })
      .catch((err) => {
        console.log("err", err?.response?.data?.message);
      });
  }, [userId]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          marginRight: "140px",
          gap: 2,
        }}
      >
        <Box>
          <Typography component="h1" variant="h5" sx={{ marginLeft: "15px" }}>
            User Group List
          </Typography>

          <Avatar
            className="groupIcon"
            sx={{ m: 1, bgcolor: "transparent", color: "black" }}
          >
            <PersonIcon sx={{ fontSize: 100 }} />
          </Avatar>

          <Stack spacing={1} direction="column" margin={2}>
            <Button variant="contained">
              <Link
                style={{ color: "white", textDecoration: "none" }}
                to="/createGroup"
              >
                start a new group
              </Link>
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h3>
            Your Current Balance ={" "}
            <span
              style={{
                color: dashBordData?.totalBalance < 0 ? "red" : "green",
              }}
            >
              {dashBordData?.totalBalance}
            </span>
          </h3>

          {groupList.map((group) => (
            <Card
              key={group.groupId}
              sx={{ width: "350px", margin: "10px auto", cursor: "pointer" }}
              onClick={() =>
                navigate(`/listGropExpenses/${group.groupId}`, {
                  state: { groupMembers: group?.members },
                })
              }
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.primary"
                  gutterBottom
                >
                  Group Name: {group.groupName}
                </Typography>
                {group.members.map((member) => (
                  <Typography
                    key={member.memberId}
                    variant="body2"
                    color="text.secondary"
                  >
                    {member.firstName} {member.lastName}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
        <div
          style={{
            width: "350px",
            margin: "10px 0",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "end",
          }}
        >
          <h3 style={{ display: "flex", justifyContent: "start" }}>
            Friends Balance
          </h3>
          {dashBordData?.personBalances?.map((data) => (
            <Card key={data?.userId}>
              <CardContent sx={{ width: "200px" }}>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Balance
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {data?.firstName} {data?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Balance:{" "}
                  <span
                    style={{
                      color: dashBordData?.totalBalance < 0 ? "red" : "green",
                    }}
                  >
                    {data?.balance}
                  </span>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Box>
    </>
  );
}
