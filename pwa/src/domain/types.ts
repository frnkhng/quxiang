export type UserRole = 'HQ' | 'STAFF' | 'CUSTOMER'

export interface User {
  id: string
  role: UserRole
  phone?: string
  username?: string
  storeId?: string
  profileId?: string
}

export interface Profile {
  id: string
  name: string
  phone: string
  gender?: 'male' | 'female' | 'other'
  birthDate?: string
  storeId: string
  createdAt: string
  updatedAt: string
}

export interface Record {
  id: string
  profileId: string
  type: 'detection' | 'service'
  title: string
  content: string
  images?: string[]
  staffId: string
  storeId: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  duration?: number
  price?: number
  active: boolean
}

export interface Package {
  id: string
  name: string
  description: string
  points: number
  price: number
  services: string[]
  active: boolean
}

export interface Transaction {
  id: string
  profileId: string
  type: 'purchase' | 'consume'
  packageId?: string
  points: number
  amount?: number
  createdAt: string
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface AIConversation {
  id: string
  profileId: string
  messages: AIMessage[]
  createdAt: string
  updatedAt: string
}

export interface Store {
  id: string
  name: string
  address?: string
  phone?: string
  active: boolean
}
