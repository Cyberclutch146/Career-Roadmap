'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { auth } from '@/lib/firebase'
import { signOut, updateProfile } from 'firebase/auth'
import {
  User,
  Settings,
  BookOpen,
  LogOut,
  Target,
  Clock,
  Flame,
  ChevronRight,
  Edit2,
  CheckCircle2,
  Trash2,
  CalendarDays
} from 'lucide-react'
import type { Roadmap } from '@/types'
import { shouldSyncWithFirestore } from '@/lib/sync'

export default function ProfilePage() {
  const router = useRouter()
  const { user, savedRoadmaps, setSavedRoadmaps, logout } = useStore()
  
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.name || '')
  const [isSavingName, setIsSavingName] = useState(false)

  const totalCompletedLessons = savedRoadmaps.reduce(
    (sum, rm) => sum + (rm.completed_lessons_count || 0),
    0
  )
  const dayStreak = user?.streak || 0 // Assuming calculateStreak is added to store or we just use user.streak for now. Let's compute it if we can. Actually we'll just display it, as the dashboard handles the update logic. For now use the store value. Wait, dashboard computes it locally and doesn't store it back to user yet. Let's just use what we have or a placeholder since dashboard has the logic. We will use user?.streak for simplicity if we don't have the completions here.

  // Date formatting
  const memberSince = user?.last_active ? new Date(user.last_active).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'

  const handleLogout = async () => {
    try {
      await signOut(auth)
      logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user?.name) {
      setIsEditingName(false)
      return
    }

    setIsSavingName(true)
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: newName
        })
        
        // Update store
        if (user) {
          useStore.setState({
            user: { ...user, name: newName }
          })
        }
      }
      setIsEditingName(false)
    } catch (error) {
      console.error('Failed to update name:', error)
    } finally {
      setIsSavingName(false)
    }
  }

  const handleDeleteRoadmap = async (roadmapId: string) => {
    if (!confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) return
    
    try {
      const syncWithFirestore = shouldSyncWithFirestore(user)
      if (syncWithFirestore && user) {
        const { doc, deleteDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        await deleteDoc(doc(db, 'users', user.id, 'roadmaps', roadmapId))
      } else {
        localStorage.removeItem(`roadmap_${roadmapId}`)
        localStorage.removeItem(`progress_${roadmapId}`)
        localStorage.removeItem(`progress_dates_${roadmapId}`)
        localStorage.removeItem(`bookmarks_${roadmapId}`)
      }
      
      setSavedRoadmaps(savedRoadmaps.filter(r => r.id !== roadmapId))
    } catch (e) {
      console.error('Failed to delete roadmap:', e)
    }
  }

  if (!user) return null; // Let AuthProvider handle redirect

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col">
      <Navbar />

      <div className="pt-24 pb-16 flex-grow">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface mb-2">
              Your Profile
            </h1>
            <p className="text-on-surface-variant text-sm">
              Manage your account, stats, and saved roadmaps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Left Column: Identity & Settings */}
            <div className="space-y-6 md:col-span-1">
              
              {/* Identity Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface-container/60 border border-outline-variant/40 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-4">
                  <User className="w-8 h-8" />
                </div>
                
                {isEditingName ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-zinc-950 border border-outline rounded-md px-2 py-1 text-sm text-on-surface w-full focus:outline-none focus:border-amber-500"
                      autoFocus
                    />
                    <button 
                      onClick={handleUpdateName}
                      disabled={isSavingName}
                      className="p-1.5 bg-amber-500/10 text-amber-500 rounded-md hover:bg-amber-500/20 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2 group">
                    <h2 className="text-xl font-headline font-bold text-on-surface">{user.name}</h2>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="text-tertiary hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                
                <p className="text-sm text-on-surface-variant mb-4 truncate" title={user.email}>{user.email}</p>
                
                <div className="flex items-center gap-2 text-xs text-on-surface-variant pt-4 border-t border-outline-variant/40">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Member since {memberSince}</span>
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-surface-container/60 border border-outline-variant/40 rounded-2xl p-6"
              >
                <h3 className="text-sm font-semibold text-on-surface mb-4 uppercase tracking-wider">Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm">Roadmaps</span>
                    </div>
                    <span className="font-bold text-on-surface tabular-nums">{savedRoadmaps.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Lessons</span>
                    </div>
                    <span className="font-bold text-on-surface tabular-nums">{totalCompletedLessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span className="text-sm">Day Streak</span>
                    </div>
                    <span className="font-bold text-on-surface tabular-nums">{dayStreak}</span>
                  </div>
                </div>
              </motion.div>

              {/* Account Settings */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface-container/60 border border-outline-variant/40 rounded-2xl p-6 space-y-3"
              >
                <h3 className="text-sm font-semibold text-on-surface mb-4 uppercase tracking-wider">Settings</h3>
                
                <Button 
                  variant="secondary" 
                  className="w-full justify-start text-on-surface-variant bg-zinc-800/50 hover:bg-surface-container-high border-none"
                  onClick={() => alert("Password reset link would be sent to your email.")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full justify-start text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 border-none"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Roadmap Library */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-surface-container/60 border border-outline-variant/40 rounded-2xl p-6 min-h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-headline font-bold text-on-surface">Your Library</h3>
                  <Link href="/generate">
                    <Button size="sm" variant="ghost" className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10">
                      New Roadmap
                    </Button>
                  </Link>
                </div>

                {savedRoadmaps.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-outline-variant rounded-xl">
                    <BookOpen className="w-8 h-8 text-outline mx-auto mb-3" />
                    <p className="text-sm text-on-surface-variant mb-4">No roadmaps saved yet.</p>
                    <Link href="/generate">
                      <Button size="sm">Create Your First Roadmap</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedRoadmaps.map((roadmap) => {
                      const totalLessons = roadmap.generated_roadmap.overview.total_lessons || 1
                      const completedLessons = roadmap.completed_lessons_count || 0
                      const progress = Math.round((completedLessons / totalLessons) * 100)

                      return (
                        <div 
                          key={roadmap.id} 
                          className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-outline-variant hover:border-outline transition-colors"
                        >
                          <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                            <Link href={`/roadmap/${roadmap.id}`} className="block">
                              <h4 className="font-semibold text-sm text-on-surface truncate group-hover:text-amber-500 transition-colors">
                                {roadmap.goal}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-on-surface-variant">
                                <span className="uppercase tracking-wider text-[10px] bg-surface-container-high px-2 py-0.5 rounded-md font-medium text-on-surface">
                                  {roadmap.skill_level}
                                </span>
                                <span>{roadmap.target_months}mo</span>
                                <span>·</span>
                                <span>{completedLessons}/{totalLessons} lessons</span>
                              </div>
                            </Link>
                          </div>
                          
                          <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                            <div className="flex-1 sm:w-32">
                              <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-on-surface-variant">Progress</span>
                                <span className="text-on-surface-variant font-bold tabular-nums">{progress}%</span>
                              </div>
                              <ProgressBar value={progress} size="sm" />
                            </div>
                            <Link href={`/roadmap/${roadmap.id}`}>
                              <button className="p-2 text-tertiary hover:text-zinc-300 hover:bg-surface-container-high rounded-lg transition-colors">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </Link>
                          </div>

                          <button 
                            onClick={() => handleDeleteRoadmap(roadmap.id)}
                            className="absolute top-4 right-4 sm:-right-2 sm:-top-2 p-1.5 bg-surface-container border border-outline-variant text-tertiary rounded-lg hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            title="Delete roadmap"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
