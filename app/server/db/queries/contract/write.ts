import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  BoardingContractInsert,
  ContractUpdate,
  tableBoardingContract,
  tableContract,
} from "@/server/db/schema";

export async function addContract(data: BoardingContractInsert) {
  try {
    // Insert the new contract into the tableBoardingContract
    const [newContract] = await db
      .insert(tableBoardingContract)
      .values(data)
      .returning();

    // Return the newly created contract
    return newContract;
  } catch (error) {
    console.error("Error adding contract:", error);
    throw new Error("Failed to add contract");
  }
}

export async function deleteContract(contractId: string) {
  try {
    const results = await db
      .delete(tableContract)
      .where(eq(tableContract.contractId, contractId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete contract: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting contract");
    }
  }
}

export async function generateContract(contractId: string) {
  try {
    // Fetch the contract details using the contractId
    const contractResults = await db
      .select()
      .from(tableContract)
      .where(eq(tableContract.contractId, contractId));

    // Check if the contract exists
    if (contractResults.length === 0) {
      throw new Error("Contract not found");
    }

    const contract = contractResults[0];

    // Here, you would typically generate the contract document (e.g., PDF)
    // For demonstration purposes, we'll just return the contract details
    return {
      success: true,
      contract,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Unknown error",
      };
    }
  }
}

export async function terminateContract(contractId: string) {
  try {
    const result = await db
      .update(tableContract)
      .set({
        status: "terminated",
      })
      .where(eq(tableContract.contractId, contractId))
      .returning();

    return result[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to terminate contract: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while terminating contract");
    }
  }
}

export async function updateContract({
  contractId,
  contract,
}: {
  contractId: string;
  contract: ContractUpdate;
}) {
  try {
    const updatedContracts = await db
      .update(tableContract)
      .set(contract)
      .where(eq(tableContract.contractId, contractId))
      .returning();

    return updatedContracts[0];
  } catch (error) {
    console.error("Error updating contract:", error);
    throw new Error("Failed to update contract");
  }
}
