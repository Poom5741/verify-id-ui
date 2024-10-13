"use client";
import { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as kycIdlFactory } from "@/declarations/kyc_backend/kyc_backend.did.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navbar";

// Define the canister ID manually (Replace with your actual KYC canister ID)
const kycCanisterId = "be2us-64aaa-aaaaa-qaabq-cai";

interface KYCStatus {
  user_id: string;
  document: string;
  status: string;
}

export default function KycManagementPage() {
  const [userId, setUserId] = useState("");
  const [document, setDocument] = useState("");
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null); // To hold KYC status information
  const [message, setMessage] = useState("");

  const [adminUserId, setAdminUserId] = useState(""); // Used for admin actions
  const [adminMessage, setAdminMessage] = useState("");

  // Function to create the actor
  const createActor = () => {
    const agent = new HttpAgent({
      host: "http://127.0.0.1:4943", // Adjust based on local or IC network
    });
    agent.fetchRootKey(); // Important for local development
    const actor = Actor.createActor(kycIdlFactory, {
      agent,
      canisterId: kycCanisterId,
    });
    return actor;
  };

  const handleSubmitKyc = async () => {
    try {
      const actor = createActor();
      const result = await actor.submit_kyc(userId, document);
      setMessage(
        result ? "KYC submitted successfully" : "KYC submission failed"
      );
    } catch (error) {
      console.error(error);
      setMessage("Error submitting KYC");
    }
  };

  const handleGetKycStatus = async () => {
    try {
      const actor = createActor();
      const result = (await actor.get_kyc_status(userId)) as KYCStatus[] | null;

      // Log the entire result for debugging
      console.log("KYC Status Result:", result);

      if (result && result.length > 0) {
        // Access the first item of the array
        const kycData = result[0];

        setKycStatus({
          user_id: kycData.user_id,
          document: kycData.document || "Document unavailable",
          status: kycData.status,
        });
      } else {
        setMessage("No KYC found for this user.");
        setKycStatus(null); // Reset if no valid result
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      setMessage("Error fetching KYC status");
      setKycStatus(null); // Reset in case of error
    }
  };

  const handleApproveKyc = async () => {
    try {
      const actor = createActor();
      const result = await actor.approve_kyc(adminUserId);
      setAdminMessage(
        result ? "KYC approved successfully" : "KYC approval failed"
      );
    } catch (error) {
      console.error(error);
      setAdminMessage("Error approving KYC");
    }
  };

  const handleRejectKyc = async () => {
    try {
      const actor = createActor();
      const result = await actor.reject_kyc(adminUserId);
      setAdminMessage(
        result ? "KYC rejected successfully" : "KYC rejection failed"
      );
    } catch (error) {
      console.error(error);
      setAdminMessage("Error rejecting KYC");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Render Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="flex justify-center items-center flex-1 p-4">
        <div className="space-y-8 max-w-2xl w-full">
          {/* Card 1: Submit KYC */}
          <Card>
            <CardHeader>
              <CardTitle>Submit KYC</CardTitle>
              <CardDescription>
                Submit your KYC information for approval.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mt-2"
                  placeholder="Enter User ID"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="document">Document</Label>
                <Input
                  id="document"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className="mt-2"
                  placeholder="Enter Document"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitKyc} className="w-full">
                Submit KYC
              </Button>
            </CardFooter>
          </Card>

          {/* Card 2: Check KYC Status */}
          <Card>
            <CardHeader>
              <CardTitle>Check KYC Status</CardTitle>
              <CardDescription>
                Check the status of your KYC submission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="userIdStatus">User ID</Label>
                <Input
                  id="userIdStatus"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mt-2"
                  placeholder="Enter User ID"
                />
              </div>
              <Button onClick={handleGetKycStatus} className="w-full">
                Get KYC Status
              </Button>

              {kycStatus && (
                <div className="mt-4">
                  <p>User ID: {kycStatus.user_id}</p>
                  <p>Document: {kycStatus.document}</p>
                  <p>Status: {kycStatus.status}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p>{message}</p>
            </CardFooter>
          </Card>

          {/* Card 3: Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Approve or reject KYC requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="adminUserId">User ID for Admin Action</Label>
                <Input
                  id="adminUserId"
                  value={adminUserId}
                  onChange={(e) => setAdminUserId(e.target.value)}
                  className="mt-2"
                  placeholder="Enter User ID"
                />
              </div>
            </CardContent>
            <CardFooter className="space-x-4">
              <Button onClick={handleApproveKyc} className="w-full">
                Approve KYC
              </Button>
              <Button
                onClick={handleRejectKyc}
                variant="destructive"
                className="w-full"
              >
                Reject KYC
              </Button>
            </CardFooter>
            <CardFooter>
              <p>{adminMessage}</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
