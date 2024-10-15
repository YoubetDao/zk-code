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
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ClaimButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 10px;

  &:hover {
    background-color: #27ae60;
  }
`;

const ProveButton = styled(ClaimButton)`
  background-color: #3498db;

  &:hover {
    background-color: #2980b9;
  }
`;

const ContentBox = styled.div`
  margin-top: 10px;
  background-color: #34495e;
  border-radius: 4px;
  padding: 10px;
  width: calc(100% - 120px);
`;

const ContentTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  background-color: #2c3e50;
  color: #ecf0f1;
  border: 1px solid #7f8c8d;
  border-radius: 4px;
  padding: 8px;
  resize: vertical;
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
  const [claimedCommit, setClaimedCommit] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchCommits = async () =>
    {
      // TODO: import private repo and get commits
      try {
        const response = await axios.get('https://api.github.com/repos/YoubetDao-Test/test-zk-git/commits');
        setCommits(response.data);
      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };

    fetchCommits();
  }, []);

  const handleClaim = (sha) => {
    setClaimedCommit(sha);
    setContent('');
  };

  const handleProve = () => {
    console.log('Proving content for commit:', claimedCommit);
    console.log('Content:', content);
    setClaimedCommit(null);
    setContent('');
  };

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
          <ButtonContainer>
            {claimedCommit !== commit.sha && (
              <ClaimButton onClick={() => handleClaim(commit.sha)}>Claim</ClaimButton>
            )}
            {claimedCommit === commit.sha && (
              <ProveButton onClick={handleProve}>Prove</ProveButton>
            )}
          </ButtonContainer>
          {claimedCommit === commit.sha && (
            <ContentBox>
              <ContentTextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here..."
              />
            </ContentBox>
          )}
        </CommitCard>
      ))}
    </CommitListContainer>
  );
};

export default CommitList;
