import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

export default async function TeacherDashboard(params: { searchParams: { search?: string } }) {
  const isTeacher = await checkRole('teacher')

  if (!isTeacher) {
    redirect('/')
  }

  const query = params.searchParams.search

  const users = query ? (await clerkClient().users.getUserList({ query })).data : []
  console.log(users)
  return (
    <>
      <h1>This is the teacher dashboard</h1>
      <p>This page is restricted to users with the teacher role.</p>
    </>
  )
}
