"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

import { useEffect, useState } from "react";

interface GitHub {
  id: number;
  name: string;
  description: string;
  html_url: string;
}

const GitHubPage = () => {
  const [data, setData] = useState();
  const [repos, setRepos] = useState<GitHub[]>([]);

  async function fetchGitHubRepos(token: string) {
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch GitHub repositories");
    }
    const repos = await response.json();
    setRepos(repos);
    return response.json();
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/github/token");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setData(data.tokens);
      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        <div>
          <h1>Access Token</h1>
          {/* <p>{dat}</p> */}
          <button
            onClick={async () => {
              try {
                const repos = await fetchGitHubRepos(data);
                console.log(repos);
              } catch (error) {
                console.error("Error fetching GitHub repositories:", error);
              }
            }}
          >
            Fetch GitHub Repositories
          </button>
          <div>
            <h2>GitHub Repositories</h2>
            {repos &&
              repos.map(({ id, name, description, html_url }: GitHub) => (
                <Card key={id} className="mb-4">
                  <CardHeader>
                    <h2>{name}</h2>
                    <Link href={html_url}>Visit Me</Link>
                  </CardHeader>
                  <CardContent>
                    <p>{description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ) : (
        <div>
          <h1>Cannot get Access Token</h1>
        </div>
      )}
    </div>
  );
};

export default GitHubPage;
