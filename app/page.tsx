"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Search, Flame, Loader2, Github } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchGithubStreak } from "@/lib/github"

export default function HomePage() {
  const [username, setUsername] = useState("")
  const [streak, setStreak] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [userData, setUserData] = useState<{
    avatarUrl?: string
    name?: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    setError("")

    try {
      const streakData = await fetchGithubStreak(username)
      setStreak(streakData)
      setShowResults(true)
    } catch (err) {
      setError("Could not fetch GitHub data. Please check the username and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setShowResults(false)
    setStreak(null)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      <div className="w-full max-w-md px-4">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="flex flex-col items-center"
            >
              <motion.h1
                className="text-3xl font-bold mb-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                GitHub Streak Tracker
              </motion.h1>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 pr-12 h-14 text-lg"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </Button>
                </div>
              </form>

              {error && <p className="text-red-400 mt-2">{error}</p>}

              <div className="mt-8 text-center text-sm text-slate-400">
                <p className="flex items-center justify-center gap-1">
                  <Github className="h-4 w-4" />
                  Enter any GitHub username to see their streak
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="absolute left-0 top-0 text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="pt-12 flex flex-col items-center">
                <motion.div
                  className="mb-6 flex flex-col items-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl mb-2 text-center">{username}&apos;s streak</h2>

                  <div className="relative flex flex-col items-center mb-4">
                    <StreakFlame streak={streak || 0} />
                  </div>

                  <div className="text-6xl font-bold flex items-center gap-2">
                    <span className="text-orange-400">{streak || 0}</span>
                    <span className="text-lg text-slate-400">days</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function StreakFlame({ streak }: { streak: number }) {
  const intensity = Math.min(1, streak / 100)
  const boxShadow = `0 0 ${20 + streak * 2}px ${10 + streak}px rgba(255, 165, 0, ${0.3 + intensity * 0.5})`

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3,
        }}
        style={{ boxShadow }}
        className="mb-4"
      >
        <Flame
          className="h-24 w-24 text-orange-500"
          style={{
            filter: `drop-shadow(0 0 ${8 + streak / 5}px rgba(255, 165, 0, ${0.6 + intensity * 0.4}))`,
          }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 opacity-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ delay: 0.5 }}
      >
        <FlameAnimation />
      </motion.div>
    </div>
  )
}

function FlameAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Flame className="h-24 w-24 text-orange-400 opacity-50" />
      </motion.div>
    </div>
  )
}

