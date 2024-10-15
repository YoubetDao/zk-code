 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CommitListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const CommitCard = styled.div`
  background-color: #2c3e50;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: #ecf0f1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CommitMessage = styled.h3`
  margin: 0 0 10px 0;
  color: #3498db;
`;

const CommitDetails = styled.p`
  margin: 5px 0;
  font-size: 14px;
`;

const CommitAuthor = styled.span`
  font-weight: bold;
  color: #e74c3c;
`;

const CommitDate = styled.span`
  color: #bdc3c7;
`;

const CommitList = () => {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await axios.get('https://api.github.com/repos/YoubetDao-Test/test-zk-git/commits');
        setCommits(response.data);
      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };

    fetchCommits();
  }, []);

  return (
    <CommitListContainer>
      <h2>Recent Commits</h2>
      {commits.map((commit) => (
        <CommitCard key={commit.sha}>
          <CommitMessage>{commit.commit.message}</CommitMessage>
          <CommitDetails>
            <CommitAuthor>{commit.commit.author.name}</CommitAuthor> committed on{' '}
            <CommitDate>{new Date(commit.commit.author.date).toLocaleString()}</CommitDate>
          </CommitDetails>
          <CommitDetails>SHA: {commit.sha.substring(0, 7)}</CommitDetails>
        </CommitCard>
      ))}
    </CommitListContainer>
  );
};

export default CommitList;