// GitHub doesn't provide a direct API for streaks, so we need to fetch contributions and calculate it
export async function fetchGithubStreak(username: string): Promise<number> {
  try {
    // Call our own API route instead of GitHub directly
    const response = await fetch(`/api/github/${username}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch GitHub data")
    }

    const data = await response.json()
    return data.streak
  } catch (error) {
    console.error("Error fetching GitHub streak:", error)
    throw error
  }
}

function calculateStreak(contributionsHtml: string): number {
  // This is a simplified implementation
  // In a real-world scenario, you would parse the SVG/HTML more carefully

  // For demo purposes, we'll extract the contribution data from the HTML
  // GitHub's contribution graph has data-date attributes with contribution counts

  // Find all contribution cells
  const dateRegex = /data-date="([^"]+)"/g
  const countRegex = /data-count="([^"]+)"/g

  const dates: string[] = []
  const counts: number[] = []

  let match
  while ((match = dateRegex.exec(contributionsHtml)) !== null) {
    dates.push(match[1])
  }

  while ((match = countRegex.exec(contributionsHtml)) !== null) {
    counts.push(Number.parseInt(match[1], 10))
  }

  // Combine dates and counts
  const contributions = dates.map((date, index) => ({
    date,
    count: counts[index] || 0,
  }))

  // Sort by date (most recent first)
  contributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate current streak (consecutive days with contributions > 0)
  let streak = 0
  for (const contribution of contributions) {
    if (contribution.count > 0) {
      streak++
    } else {
      break // Streak ends at first day with no contributions
    }
  }

  return streak
}

