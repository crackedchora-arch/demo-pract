import { useState } from "react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useToggleUserMutation,
} from "./services/api/userApi";
import type { User } from "./types/user.types";

function App() {
  const { data: users = [] } = useGetUsersQuery(undefined);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [toggleUser] = useToggleUserMutation();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;
    console.log(name);
    await createUser(name).unwrap();

    setName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter user name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
          }}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create User"}
        </button>
      </form>
      <hr />
      <div>
        {users.map((u: User) => (
          <div key={u._id}>
            {u.name} - {u.active ? "Active" : "Inactive"}
            <button onClick={() => toggleUser(u._id)}>Toggle</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
