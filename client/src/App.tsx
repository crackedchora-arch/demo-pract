import { useEffect, useRef, useState } from "react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useToggleUserMutation,
} from "./services/api/userApi";
import type { User } from "./types/user.types";
import UserCard from "./components/UserCard";
import { Button } from "./components/ui/button";
import UserCardSkeleton from "./components/skeletons/UserCardSkeleton";
import UploadComponent from "./components/dialogs/UploadComponent";
import UploadImageFromServer from "./components/dialogs/UploadImageFromServer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MediaCropDialogTS from "./components/dialogs/MediaCrop";
import VideoCallHomepage from "./pages/VideoCallHomepage";

function App() {
  const limit = 10;
  const [page, setPage] = useState(1);

  const {
    data: usersData,
    isFetching,
    isLoading: isUsersLoading,
  } = useGetUsersQuery({
    page,
    limit,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [toggleUser] = useToggleUserMutation();
  const [name, setName] = useState("");
  console.log("userdata", usersData);
  const toggleActive = async (id: string) => {
    await toggleUser(id).unwrap();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;
    console.log(name);
    await createUser(name).unwrap();

    setName("");
  };

  // intersection observer
  useEffect(() => {
    console.log("observer ref hitted");
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isFetching && usersData?.hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1, // trigger when 100% visible
      }
    );

    const currrentRef = observerRef.current;
    if (currrentRef) {
      observer.observe(currrentRef);
    }

    return () => {
      if (currrentRef) {
        observer.unobserve(currrentRef);
      }
    };
  }, [isFetching, usersData?.hasMore]);

  if (isUsersLoading) return <>Loading...</>;
  // return (
  //   <div className="p-5 min-h-screen">
  //     <div className="flex mb-5 justify-between items-center">
  //       <form onSubmit={handleSubmit}>
  //         <input
  //           type="text"
  //           placeholder="Enter user name"
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //           className="bg-muted rounded-full py-2 px-6 mr-3 "
  //         />

  //         <Button type="submit" disabled={isLoading}>
  //           {isLoading ? "Creating..." : "Create User"}
  //         </Button>
  //       </form>
  //       <div className="flex gap-3">
  //         <UploadComponent />
  //         <UploadImageFromServer />
  //         <MediaCropDialogTS />
  //       </div>
  //     </div>

  //     <hr />

  //     <div className="flex flex-col gap-3 mt-3  w-full  items-center">
  //       {isUsersLoading ? (
  //         <UserCardSkeleton />
  //       ) : (usersData?.users ?? []).length > 0 ? (
  //         usersData?.users.map((u: User) => (
  //           <UserCard
  //             key={u._id}
  //             name={u.name}
  //             active={u.active}
  //             onToggle={() => toggleActive(u._id!)}
  //           />
  //         ))
  //       ) : (
  //         ""
  //       )}
  //       {isFetching && !isUsersLoading && usersData?.hasMore && (
  //         <UserCardSkeleton />
  //       )}

  //       {!usersData?.hasMore && (
  //         <p className="text-muted-foreground mt-2 text-sm">No more users</p>
  //       )}
  //     </div>
  //     <div
  //       className="text-muted-foreground flex justify-center items-center h-5"
  //       ref={observerRef}
  //     ></div>
  //   </div>
  // );
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/video-call" element={<VideoCallHomepage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
