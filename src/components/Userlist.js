import React, { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://ret-sih.vercel.app/api/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Users error:", err);
        setError("Unable to load users");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Users List</h2>

      {loading && <p>Loading users...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email}) - Joined:{" "}
              {user.created_at}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;