import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      Only auhtenticated users can see this page
      <UserButton />
    </div>
  );
}
