export async function fetchGithubStreak(username: string): Promise<number> {
  // Note: This is a mock implementation as GitHub doesn't have a public API for contribution streaks
  // In a real implementation, you would need to scrape GitHub or use a third-party API

  // Simulating API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, we'll generate a random streak between 0 and 150
  // You'd replace this with actual API call or scraping logic
  const randomStreak = Math.floor(Math.random() * 150)

  return randomStreak
}

