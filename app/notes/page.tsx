import { auth } from "@clerk/nextjs/server";

export default async function Notes() {
  try {
    const { userId } = await auth();
    
    return (
      <>
        <div>Here will be the note for user: {userId}</div>
      </>
    );
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return (
      <div>Failed to retrieve user data</div>
    );
  }
}
