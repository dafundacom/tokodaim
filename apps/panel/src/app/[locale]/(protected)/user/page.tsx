import dynamicFn from "next/dynamic"

const UserContent = dynamicFn(async () => {
  const UserContent = await import("./content")
  return UserContent
})

export const metadata = {
  title: "User",
}

export default function UserPage() {
  return <UserContent />
}
