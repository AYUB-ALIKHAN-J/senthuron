
import { Proposal, ProposalFormData } from "@/types/proposal";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

// Mock storage
const STORAGE_KEY = 'proposals';

// Helper to get proposals from localStorage
const getProposals = (): Proposal[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save proposals to localStorage
const saveProposals = (proposals: Proposal[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
};

// Get all proposals
export const fetchProposals = async (): Promise<Proposal[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    return getProposals();
  } catch (error) {
    console.error('Failed to fetch proposals:', error);
    toast.error('Failed to fetch proposals');
    return [];
  }
};

// Get a single proposal by ID
export const fetchProposalById = async (id: string): Promise<Proposal | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const proposals = getProposals();
    return proposals.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Failed to fetch proposal:', error);
    toast.error('Failed to fetch proposal details');
    return null;
  }
};

// Create a new proposal
export const createProposal = async (data: ProposalFormData): Promise<Proposal> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const proposals = getProposals();
    
    const newProposal: Proposal = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      status: 'created'
    };
    
    proposals.push(newProposal);
    saveProposals(proposals);
    
    toast.success('Proposal created successfully');
    return newProposal;
  } catch (error) {
    console.error('Failed to create proposal:', error);
    toast.error('Failed to create proposal');
    throw error;
  }
};

// Update an existing proposal
export const updateProposal = async (id: string, data: ProposalFormData): Promise<Proposal> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const proposals = getProposals();
    const index = proposals.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Proposal not found');
    }
    
    const updatedProposal: Proposal = {
      ...proposals[index],
      ...data,
      id
    };
    
    proposals[index] = updatedProposal;
    saveProposals(proposals);
    
    toast.success('Proposal updated successfully');
    return updatedProposal;
  } catch (error) {
    console.error('Failed to update proposal:', error);
    toast.error('Failed to update proposal');
    throw error;
  }
};

// Delete a proposal
export const deleteProposal = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    const proposals = getProposals();
    const index = proposals.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Proposal not found');
    }
    
    // Mark as deleted instead of removing
    proposals[index].status = 'deleted';
    saveProposals(proposals);
    
    toast.success('Proposal deleted successfully');
  } catch (error) {
    console.error('Failed to delete proposal:', error);
    toast.error('Failed to delete proposal');
    throw error;
  }
};
