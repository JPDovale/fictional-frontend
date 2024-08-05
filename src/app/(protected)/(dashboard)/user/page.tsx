'use client'
import { useState } from 'react'
import { UserView } from './components/UserView'
import { UserEdit } from './components/UserEdit'

export default function UserPage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <main className="max-w-3xl mx-auto py-4 h-full flex-col flex w-full">
      {!isEditing && <UserView setIsEditing={setIsEditing} />}
      {isEditing && <UserEdit setIsEditing={setIsEditing} />}
    </main>
  )
}
