'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { AppState, Profile, Task, TaskCompletion, AvatarItem, UserAvatarItem, FamilyRule, Family, AvatarConfig } from '@/types'
import { DEMO_STATE } from './demo-data'
import { format } from 'date-fns'

type Action =
  | { type: 'INIT'; payload: AppState }
  | { type: 'LOGIN'; payload: { userId: string; familyId: string } }
  | { type: 'LOGOUT' }
  | { type: 'CREATE_FAMILY'; payload: { family: Family; profile: Profile } }
  | { type: 'ADD_PROFILE'; payload: Profile }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: TaskCompletion }
  | { type: 'UNCOMPLETE_TASK'; payload: { taskId: string; userId: string; date: string } }
  | { type: 'PURCHASE_ITEM'; payload: { userId: string; item: AvatarItem } }
  | { type: 'EQUIP_ITEM'; payload: { userId: string; itemId: string; avatarChanges: Partial<AvatarConfig> } }
  | { type: 'ADD_FAMILY_RULE'; payload: FamilyRule }
  | { type: 'UPDATE_PROFILE'; payload: Partial<Profile> & { id: string } }

const STORAGE_KEY = 'famia-state'

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INIT':
      return action.payload

    case 'LOGIN':
      return {
        ...state,
        currentUserId: action.payload.userId,
        currentFamilyId: action.payload.familyId,
      }

    case 'LOGOUT':
      return { ...state, currentUserId: null, currentFamilyId: null }

    case 'CREATE_FAMILY': {
      return {
        ...state,
        families: [...state.families, action.payload.family],
        profiles: [...state.profiles, action.payload.profile],
      }
    }

    case 'ADD_PROFILE':
      return { ...state, profiles: [...state.profiles, action.payload] }

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload ? { ...t, isActive: false } : t),
      }

    case 'COMPLETE_TASK': {
      const comp = action.payload
      const bonus = comp.selfInitiated ? 5 : 0
      const totalPoints = comp.pointsEarned + bonus
      return {
        ...state,
        completions: [...state.completions, { ...comp, pointsEarned: totalPoints }],
        profiles: state.profiles.map(p =>
          p.id === comp.userId
            ? { ...p, pointsTotal: p.pointsTotal + totalPoints }
            : p
        ),
      }
    }

    case 'UNCOMPLETE_TASK': {
      const { taskId, userId, date } = action.payload
      const completion = state.completions.find(
        c => c.taskId === taskId && c.userId === userId && c.completedDate === date
      )
      if (!completion) return state
      return {
        ...state,
        completions: state.completions.filter(c => c.id !== completion.id),
        profiles: state.profiles.map(p =>
          p.id === userId
            ? { ...p, pointsTotal: Math.max(0, p.pointsTotal - completion.pointsEarned) }
            : p
        ),
      }
    }

    case 'PURCHASE_ITEM': {
      const { userId, item } = action.payload
      const newUserItem: UserAvatarItem = {
        id: `uai-${Date.now()}`,
        userId,
        itemId: item.id,
        acquiredAt: new Date().toISOString(),
        isEquipped: false,
      }
      return {
        ...state,
        userAvatarItems: [...state.userAvatarItems, newUserItem],
        profiles: state.profiles.map(p =>
          p.id === userId
            ? { ...p, pointsTotal: p.pointsTotal - item.pointsCost }
            : p
        ),
      }
    }

    case 'EQUIP_ITEM': {
      const { userId, itemId, avatarChanges } = action.payload
      return {
        ...state,
        userAvatarItems: state.userAvatarItems.map(uai => {
          if (uai.userId !== userId) return uai
          // Find the category of the equipping item
          const equippingItem = state.avatarItems.find(i => i.id === itemId)
          const equippingCategory = equippingItem?.category
          // Unequip items of same category, equip the selected one
          const sameCategory = state.avatarItems.find(i => i.id === uai.itemId)?.category === equippingCategory
          if (sameCategory && uai.itemId !== itemId) return { ...uai, isEquipped: false }
          if (uai.itemId === itemId) return { ...uai, isEquipped: true }
          return uai
        }),
        profiles: state.profiles.map(p =>
          p.id === userId
            ? { ...p, avatarConfig: { ...p.avatarConfig, ...avatarChanges } }
            : p
        ),
      }
    }

    case 'ADD_FAMILY_RULE':
      return { ...state, familyRules: [...state.familyRules, action.payload] }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }

    default:
      return state
  }
}

interface StoreContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  // Helpers
  currentProfile: Profile | null
  currentFamily: Family | null
  getChildProfiles: () => Profile[]
  getParentProfiles: () => Profile[]
  getTodayTasks: (userId: string) => Task[]
  getTodayCompletions: (userId: string) => TaskCompletion[]
  isTaskCompletedToday: (taskId: string, userId: string) => boolean
  getOwnedItems: (userId: string) => AvatarItem[]
  getEquippedItems: (userId: string) => AvatarItem[]
  completeTask: (task: Task, userId: string, selfInitiated: boolean) => void
  uncompleteTask: (taskId: string, userId: string) => void
  purchaseItem: (item: AvatarItem, userId: string) => void
  equipItem: (item: AvatarItem, userId: string) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEMO_STATE)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as AppState
        dispatch({ type: 'INIT', payload: parsed })
      } else {
        dispatch({ type: 'INIT', payload: DEMO_STATE })
      }
    } catch {
      dispatch({ type: 'INIT', payload: DEMO_STATE })
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const currentProfile = state.profiles.find(p => p.id === state.currentUserId) ?? null
  const currentFamily = state.families.find(f => f.id === state.currentFamilyId) ?? null

  const getChildProfiles = useCallback(() =>
    state.profiles.filter(p => p.familyId === state.currentFamilyId && p.role === 'child'),
    [state.profiles, state.currentFamilyId]
  )

  const getParentProfiles = useCallback(() =>
    state.profiles.filter(p => p.familyId === state.currentFamilyId && p.role === 'parent'),
    [state.profiles, state.currentFamilyId]
  )

  const getTodayTasks = useCallback((userId: string) => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0=Sun, 6=Sat
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    return state.tasks.filter(t => {
      if (!t.isActive) return false
      if (t.assignedTo && t.assignedTo !== userId) return false
      if (t.frequency === 'daily') return true
      if (t.frequency === 'weekday' && isWeekday) return true
      if (t.frequency === 'weekend' && isWeekend) return true
      return false
    })
  }, [state.tasks])

  const getTodayCompletions = useCallback((userId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return state.completions.filter(c => c.userId === userId && c.completedDate === today)
  }, [state.completions])

  const isTaskCompletedToday = useCallback((taskId: string, userId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return state.completions.some(
      c => c.taskId === taskId && c.userId === userId && c.completedDate === today
    )
  }, [state.completions])

  const getOwnedItems = useCallback((userId: string) => {
    const ownedIds = state.userAvatarItems
      .filter(uai => uai.userId === userId)
      .map(uai => uai.itemId)
    return state.avatarItems.filter(item => ownedIds.includes(item.id))
  }, [state.userAvatarItems, state.avatarItems])

  const getEquippedItems = useCallback((userId: string) => {
    const equippedIds = state.userAvatarItems
      .filter(uai => uai.userId === userId && uai.isEquipped)
      .map(uai => uai.itemId)
    return state.avatarItems.filter(item => equippedIds.includes(item.id))
  }, [state.userAvatarItems, state.avatarItems])

  const completeTask = useCallback((task: Task, userId: string, selfInitiated: boolean) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const completion: TaskCompletion = {
      id: `comp-${Date.now()}`,
      taskId: task.id,
      userId,
      completedDate: today,
      selfInitiated,
      pointsEarned: task.pointsValue,
      note: '',
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'COMPLETE_TASK', payload: completion })
  }, [])

  const uncompleteTask = useCallback((taskId: string, userId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    dispatch({ type: 'UNCOMPLETE_TASK', payload: { taskId, userId, date: today } })
  }, [])

  const purchaseItem = useCallback((item: AvatarItem, userId: string) => {
    dispatch({ type: 'PURCHASE_ITEM', payload: { userId, item } })
  }, [])

  const equipItem = useCallback((item: AvatarItem, userId: string) => {
    dispatch({ type: 'EQUIP_ITEM', payload: { userId, itemId: item.id, avatarChanges: item.avatarChanges } })
  }, [])

  return (
    <StoreContext.Provider value={{
      state,
      dispatch,
      currentProfile,
      currentFamily,
      getChildProfiles,
      getParentProfiles,
      getTodayTasks,
      getTodayCompletions,
      isTaskCompletedToday,
      getOwnedItems,
      getEquippedItems,
      completeTask,
      uncompleteTask,
      purchaseItem,
      equipItem,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
