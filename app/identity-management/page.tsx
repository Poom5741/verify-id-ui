"use client";
import { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as identityCanisterIdl } from "@/declarations/identity_canister_project_backend/identity_canister_project_backend.did.js";
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
import { Navbar } from "@/components/navbar"; // Import Navbar component

// Define the canister ID manually
const identityCanisterId = "bw4dl-smaaa-aaaaa-qaacq-cai"; // Replace with your actual canister ID

const IdentityManagementPage = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Function to create the actor
  const createActor = () => {
    const agent = new HttpAgent({
      host: "http://127.0.0.1:4943", // Local replica for development
    });
    agent.fetchRootKey(); // Important for local development
    const actor = Actor.createActor(identityCanisterIdl, {
      agent,
      canisterId: identityCanisterId,
    });
    return actor;
  };

  const handleRegister = async () => {
    try {
      const actor = createActor();
      const result = await actor.register_identity(id, name, email);
      setMessage(
        result ? "Identity registered successfully" : "Identity already exists"
      );
    } catch (error) {
      console.error(error);
      setMessage("Error registering identity");
    }
  };

  const handleUpdate = async () => {
    try {
      const actor = createActor();
      const result = await actor.update_identity(id, name, email);
      setMessage(
        result ? "Identity updated successfully" : "Identity not found"
      );
    } catch (error) {
      console.error(error);
      setMessage("Error updating identity");
    }
  };

  const handleDelete = async () => {
    try {
      const actor = createActor();
      const result = await actor.delete_identity(id);
      setMessage(
        result ? "Identity deleted successfully" : "Identity not found"
      );
    } catch (error) {
      console.error(error);
      setMessage("Error deleting identity");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Render Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="flex justify-center items-center flex-1 p-4">
        <Card className="mt-8 p-6 w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Identity Management
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Manage your identity information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="mt-2"
                placeholder="Enter ID"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
                placeholder="Enter Name"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                placeholder="Enter Email"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button
              onClick={handleRegister}
              variant="default"
              className="w-full"
            >
              Register Identity
            </Button>
            <Button onClick={handleUpdate} variant="default" className="w-full">
              Update Identity
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full"
            >
              Delete Identity
            </Button>
          </CardFooter>

          <CardFooter>
            <p className="text-center text-lg text-gray-600">{message}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default IdentityManagementPage;
