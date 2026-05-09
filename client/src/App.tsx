import { useState } from "react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useToggleUserMutation,
} from "./services/api/userApi";
import type { User } from "./types/user.types";
import UserCard from "./components/UserCard";

function App() {
  const { data: users = [] } = useGetUsersQuery(undefined);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [toggleUser] = useToggleUserMutation();
  const [name, setName] = useState("");

  const toggleActive = async (id: string) => {
    await toggleUser(id).unwrap();
  }

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
      <div className="flex flex-col gap-3 mt-3  w-full bg-primary items-center mb-3">
        {users.map((u: User) => (
          <UserCard 
          name={u.name}
          active={u.active}
          onToggle={() => toggleActive(u._id!)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
