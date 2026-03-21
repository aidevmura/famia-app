export type UserRole = 'parent' | 'child'
export type Gender = 'girl' | 'boy'
export type TaskCategory = 'chore' | 'habit' | 'routine'
export type TaskFrequency = 'daily' | 'weekly' | 'weekday' | 'weekend'
export type ItemCategory = 'hair' | 'eyes' | 'mouth' | 'hat' | 'glasses' | 'shirt' | 'background'
export type ItemRarity = 'common' | 'rare' | 'epic'

export interface Family {
  id: string
  name: string
  inviteCode: string
  createdAt: string
}

export interface Profile {
  id: string
  familyId: string
  name: string
  role: UserRole
  gender: Gender
  avatarConfig: AvatarConfig
  pointsTotal: number
  picturePassword: string[] | null // emoji IDs for child
  passwordHash: string | null      // for parent
  createdAt: string
}

export interface AvatarConfig {
  sex: 'man' | 'woman'
  faceColor: string
  earSize: 'small' | 'big'
  hairColor: string
  hairStyle: 'normal' | 'thick' | 'mohawk' | 'womanLong' | 'womanShort'
  hatColor: string
  hatStyle: 'none' | 'beanie' | 'turban'
  eyeStyle: 'circle' | 'oval' | 'smile'
  glassesStyle: 'none' | 'round' | 'square'
  noseStyle: 'short' | 'long' | 'round'
  mouthStyle: 'laugh' | 'smile' | 'peace'
  shirtStyle: 'hoody' | 'short' | 'polo'
  shirtColor: string
  bgColor: string
}

export interface Task {
  id: string
  familyId: string
  createdBy: string
  assignedTo: string | null // null = all children
  title: string
  description: string
  category: TaskCategory
  pointsValue: number
  frequency: TaskFrequency
  scheduledTime: string | null
  isActive: boolean
  emoji: string
  createdAt: string
}

export interface TaskCompletion {
  id: string
  taskId: string
  userId: string
  completedDate: string // YYYY-MM-DD
  selfInitiated: boolean
  pointsEarned: number
  note: string
  createdAt: string
}

export interface AvatarItem {
  id: string
  name: string
  category: ItemCategory
  gender: Gender | 'both'
  pointsCost: number
  rarity: ItemRarity
  description: string
  avatarChanges: Partial<AvatarConfig>
  sortOrder: number
}

export interface UserAvatarItem {
  id: string
  userId: string
  itemId: string
  acquiredAt: string
  isEquipped: boolean
}

export interface FamilyRule {
  id: string
  familyId: string
  title: string
  content: string
  createdBy: string
  createdAt: string
}

export interface AppState {
  families: Family[]
  profiles: Profile[]
  tasks: Task[]
  completions: TaskCompletion[]
  avatarItems: AvatarItem[]
  userAvatarItems: UserAvatarItem[]
  familyRules: FamilyRule[]
  currentUserId: string | null
  currentFamilyId: string | null
}
