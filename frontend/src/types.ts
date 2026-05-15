export type WorkerProfile = {
  _id: string
  category: string
  headline?: string
  serviceArea?: string
  priceNote?: string
  experienceYears: number
  isVerified: boolean
  rating?: number
  completedJobs?: number
  isOnline?: boolean
  avatarUrl?: string

  // WorkersPage uses `selectedWorker.name`
  // Backend stores name under `worker.user.name` (populated), so keep both optional.
  name?: string

  user?: { name: string; phone?: string }
}


export type RentalListing = {
  _id: string
  title: string
  address?: string
  kind: 'house' | 'room'
  rentPerMonth: number
  deposit?: number
  rating?: number
  reviewsCount?: number
  isAvailable?: boolean
  images?: string[]
  owner?: { name: string; phone?: string; avatarUrl?: string }
}

