import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PublicTaskDetailsPage = () => {
    const { taskId } = useParams(); // Get task ID from URL params
    const [task, setTask] = useState(null);
    const [offerMessage, setOfferMessage] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state for task data

    // Fetch task details on component mount
    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                console.log(`Fetching details for task ID: ${taskId}`); // Debugging: Log taskId
                const { data } = await axios.get(`/api/tasks/public/${taskId}`);
                
                if (data && data.task) {
                    setTask(data.task); // Set the task data from response
                    setLoading(false);
                } else {
                    console.error("No task data returned:", data); // Log response if task is missing
                    setError("Failed to load task details.");
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching task details:", err);
                setError("Failed to load task details.");
                setLoading(false);
            }
        };

        fetchTaskDetails();

        // Cleanup the success and error state on unmount or when taskId changes
        return () => {
            setError(null);
            setSuccess(null);
        };
    }, [taskId]);

    const handleOfferSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to make an offer.");
            return;
        }

        if (!offerMessage.trim()) {
            setError("Offer message cannot be empty.");
            return;
        }

        try {
            // Send the offer message
            await axios.post(
                `/api/tasks/${taskId}/offer`,
                { message: offerMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess("Offer submitted successfully!");
            setOfferMessage(""); // Clear the offer message input
        } catch (err) {
            console.error("Error submitting offer:", err);
            setError("Failed to submit offer. Please try again.");
        }
    };

    if (loading) return <p>Loading task details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <p><strong>Category:</strong> {task.category}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>

            {/* Offer Form */}
            <h3>Make an Offer</h3>
            <form onSubmit={handleOfferSubmit}>
                <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Write your offer message here..."
                    required
                />
                <button type="submit">Submit Offer</button>
            </form>

            {success && <p style={{ color: "green" }}>{success}</p>}
        </div>
    );
};

export default PublicTaskDetailsPage;
