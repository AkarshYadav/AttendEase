import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

export default async function StudentDashboard(params: { searchParams: { search?: string } }) {
  const isStudent = await checkRole('student')

  if (!isStudent) {
    redirect('/')
  }

  const query = params.searchParams.search

  const users = query ? (await clerkClient().users.getUserList({ query })).data : []
  console.log(users)
  return (
    <>
      <h1>This is the student dashboard</h1>
      <p>This page is restricted to users with the student role.</p>
    </>
  )
}
