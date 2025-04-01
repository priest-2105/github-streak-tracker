import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  const username = params.username

  try {
    // Use GitHub's public API to get user data
    const response = await fetch(`https://api.github.com/users/${username}`)

    if (!response.ok) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: response.status })
    }

    const userData = await response.json()

    // For demonstration purposes, we'll calculate a "streak" based on
    // the user's public activity metrics
    // In a real app, you would need to use GitHub's GraphQL API with authentication
    // to get detailed contribution data

    // Create a deterministic but random-looking streak based on user data
    const createdAt = new Date(userData.created_at)
    const daysOnGitHub = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    const publicRepos = userData.public_repos || 0
    const followers = userData.followers || 0

    // Generate a streak that feels realistic based on user's GitHub activity
    // This is just for demonstration - not real streak data
    const activityFactor = publicRepos * 0.5 + followers * 0.3
    const streak = Math.min(
      Math.max(1, Math.floor(activityFactor * (daysOnGitHub / 365))),
      120, // Cap at 120 days to keep it realistic
    )

    return NextResponse.json({
      username: userData.login,
      avatarUrl: userData.avatar_url,
      streak: streak,
      name: userData.name,
      bio: userData.bio,
    })
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 })
  }
}

