import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Modal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Feed = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");

  // 🔐 PROTECTED ROUTE
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/signin");
    }
  }, [navigate]);

  // 🔍 FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/posts/search/${query}`
        );
        setPosts(response.data);
      } catch (error) {
        setPosts([]);
      }
    };

    const fetchInitialPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/posts`
        );
        setPosts(response.data);
      } catch (error) {
        setPosts([]);
      }
    };

    if (query.length === 0) {
      fetchInitialPosts();
    } else if (query.length > 2) {
      fetchPosts();
    }
  }, [query]);

  // 📨 APPLY HANDLER
  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post("http://localhost:8081/applications/apply", {
       jobId: selectedJob._id,
        applicantId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
        message: applyMessage,
      });

      alert("Applied successfully");
      setSelectedJob(null);
      setApplyMessage("");
    } catch (err) {
      alert("Failed to apply");
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Job Feed
        </Typography>

        <Button
          variant="outlined"
          component={Link}
          to="/"
        >
          Home
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search job profiles or skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={4}>
        {posts.map((p) => (
          <Grid key={p._id} item xs={12} md={6} lg={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">{p.profile}</Typography>
              <Typography variant="body2">{p.desc}</Typography>

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={() => setSelectedJob(p)}
              >
                Apply
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🧾 APPLY MODAL */}
      <Modal open={!!selectedJob} onClose={() => setSelectedJob(null)}>
        <Box
          sx={{
            bgcolor: "white",
            p: 4,
            width: 400,
            mx: "auto",
            mt: "10%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Apply for Job</Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            sx={{ mt: 2 }}
            value={applyMessage}
            onChange={(e) => setApplyMessage(e.target.value)}
          />

          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
            onClick={handleApply}
          >
            Submit Application
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Feed;
