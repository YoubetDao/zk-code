"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SERVER_URL = "http://43.132.156.239:5566";

export default function Home() {
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");
  const [proof, setProof] = useState("");
  const [isProofLoading, setIsProofLoading] = useState(false);
  const [isProofValid, setIsProofValid] = useState<boolean | null>(null);

  const generateProof = async () => {
    setIsProofLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/generate-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssh_sig: signature,
          raw_msg: message,
        }),
      });
      const result = await response.json();
      setProof(result);
    } catch (e) {
      console.error(e);
      setProof("");
    }
    setIsProofLoading(false);
  };

  const verifyProof = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/verify-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof,
        }),
      });
      const result = await response.json();
      setIsProofValid(result);
    } catch (e) {
      console.error(e);
      setIsProofValid(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Commit Signature Verifier</h1>

      <div className="w-full max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="signature">
            Signature
          </label>
          <Textarea
            id="signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="min-h-[128px] bg-gray-800 text-white border-gray-700"
            placeholder="Enter signature"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="message">
            Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[128px] bg-gray-800 text-white border-gray-700"
            placeholder="Enter message"
          />
        </div>

        <Button
          onClick={generateProof}
          className="w-full bg-greyscale-50/8 border border-white/80 text-white hover:border-opacity-80 hover:bg-white/10"
          disabled={isProofLoading}
        >
          {isProofLoading ? "Generating..." : "Generate Proof"}
        </Button>

        {proof && (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="proof">
              Proof
            </label>
            <Textarea
              id="proof"
              value={proof}
              readOnly
              className="min-h-[128px] bg-gray-800 text-white border-gray-700"
            />
          </div>
        )}

        <Button
          onClick={verifyProof}
          className="w-full bg-greyscale-50/8 border border-white/80 text-white hover:border-opacity-80 hover:bg-white/10"
          disabled={!proof}
        >
          Verify Proof
        </Button>

        {isProofValid !== null && (
          <div className="mt-4 text-center">
            <p className={`text-lg font-bold ${isProofValid ? 'text-green-500' : 'text-red-500'}`}>
              Proof is {isProofValid ? 'valid' : 'invalid'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
