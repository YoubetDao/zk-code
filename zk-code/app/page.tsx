"use client"; // Add this at the very top

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Ensure you're using this import for the App Router
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

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
      <h1 className="text-2xl font-bold mb-4">GitHub Commits Verifier</h1>

      <div className="mb-4 w-full max-w-lg">
        <Input
          type="text"
          placeholder="Enter GitHub repo URL (e.g., https://github.com/wfnuser/zk-code-test)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full mb-4"
        />
        <Button
          onClick={fetchCommits}
          className="w-full bg-greyscale-50/8 border border-white/80 text-white hover:border-opacity-80 hover:bg-white/10"
        >
          Fetch Commits
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="w-full max-w-4xl">
        {" "}
        {/* Increased max-width for better table display */}
        {commits.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commits.map((commit: any) => (
                <TableRow key={commit.sha}>
                  <TableCell className="font-medium">
                    {commit.commit.message}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`https://github.com/${
                        extractRepoInfo(repoUrl)?.username
                      }/${extractRepoInfo(repoUrl)?.repoName}/commit/${
                        commit.sha
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {commit.sha.substring(0, 7)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(commit.commit.author.date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleClaim(commit.sha)}
                      className="bg-greyscale-50/8 border border-white/80 text-white hover:border-opacity-80 hover:bg-white/10"
                    >
                      proof
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          !error && <p></p>
        )}
      </div>
    </div>
  );
}
