import React from "react";
import { useAuth } from "../AuthContext";

const ProfileContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>User Information</h3>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.label}>Username:</td>
            <td style={styles.value}>{user.userName}</td>
          </tr>
          <tr>
            <td style={styles.label}>Email:</td>
            <td style={styles.value}>{user.email}</td>
          </tr>
          <tr>
            <td style={styles.label}>User ID:</td>
            <td style={styles.value}>{user.id}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: "2rem",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "1.5rem",
    borderRadius: "12px",
    maxWidth: "600px",
    margin: "auto",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },
  heading: {
    marginBottom: "1.5rem",
    color: "#00aced",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  label: {
    textAlign: "left",
    padding: "10px",
    fontWeight: "bold",
    color: "#ffffff",
    width: "40%",
  },
  value: {
    textAlign: "left",
    padding: "10px",
    color: "#dcdcdc",
  },
};

export default ProfileContent;
