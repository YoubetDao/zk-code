"use client"; // Add this at the very top

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Ensure you're using this import for the App Router

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // No more error

  const extractRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return {
        username: match[1],
        repoName: match[2],
      };
    }
    return null;
  };

  const fetchCommits = async () => {
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      setError("Invalid GitHub repository URL.");
      setCommits([]);
      return;
    }

    const { username, repoName } = repoInfo;
    const apiUrl = `https://api.github.com/repos/${username}/${repoName}/commits`;

    try {
      const response = await axios.get(apiUrl);
      setCommits(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch commits. Make sure the repository exists and is public."
      );
      setCommits([]);
    }
  };

  const handleClaim = (commitHash: string) => {
    router.push(`/claim?commit=${commitHash}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">GitHub Commit Viewer</h1>

      <div className="mb-4 w-full max-w-lg">
        <Input
          type="text"
          placeholder="Enter GitHub repo URL (e.g., https://github.com/wfnuser/zk-code-test)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full mb-4"
        />
        <Button onClick={fetchCommits} className="w-full">
          Fetch Commits
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="w-full max-w-lg">
        {commits.length > 0 ? (
          <ul className="bg-gray-800 p-4 rounded-lg shadow-lg">
            {commits.map((commit: any) => (
              <li key={commit.sha} className="mb-4">
                <p className="text-sm font-bold">{commit.commit.message}</p>
                <p className="text-xs text-gray-400">
                  Author: {commit.commit.author.name}
                </p>
                <p className="text-xs text-gray-500">
                  Date: {new Date(commit.commit.author.date).toLocaleString()}
                </p>
                <Button
                  onClick={() => handleClaim(commit.sha)}
                  className="mt-2 bg-green-500 hover:bg-green-700"
                >
                  Claim
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          !error && (
            <p>No commits found. Enter a repository URL and fetch commits.</p>
          )
        )}
      </div>
    </div>
  );
}
