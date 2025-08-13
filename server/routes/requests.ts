import { RequestHandler } from "express";

export interface ServiceRequest {
  id: string;
  userId: string;
  category: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: [number, number] | null;
  };
  urgency: "low" | "medium" | "high";
  budget: {
    min: string;
    max: string;
    type: "range" | "fixed";
  };
  preferredDate?: string;
  preferredTime?: string;
  contactPreference: "phone" | "chat" | "both";
  images: string[];
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  proposals: Proposal[];
}

export interface Proposal {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  message: string;
  price: number;
  estimatedDuration: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

// Mock storage - in production, use a real database
let requests: ServiceRequest[] = [
  {
    id: "req_1",
    userId: "user_1",
    category: "eletricista",
    title: "Instalação de chuveiro elétrico",
    description: "Preciso instalar um chuveiro elétrico novo no banheiro. O ponto já existe, só precisa conectar.",
    location: {
      address: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      coordinates: [-23.550520, -46.633308]
    },
    urgency: "medium",
    budget: {
      min: "150",
      max: "300",
      type: "range"
    },
    preferredDate: "2024-02-15",
    preferredTime: "morning",
    contactPreference: "both",
    images: [],
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    proposals: [
      {
        id: "prop_1",
        professionalId: "prof_1",
        professionalName: "Carlos Silva",
        professionalAvatar: "/placeholder.svg",
        message: "Olá! Posso te ajudar com a instalação do chuveiro. Tenho 10 anos de experiência e posso fazer hoje mesmo.",
        price: 200,
        estimatedDuration: "1-2 horas",
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ]
  }
];

// GET /api/requests - List all requests for user
export const handleGetRequests: RequestHandler = (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '') || 'user_1'; // Mock auth
  
  const userRequests = requests.filter(request => request.userId === userId);
  
  res.json({
    requests: userRequests,
    total: userRequests.length
  });
};

// GET /api/requests/:id - Get specific request
export const handleGetRequest: RequestHandler = (req, res) => {
  const { id } = req.params;
  const request = requests.find(r => r.id === id);
  
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  res.json(request);
};

// POST /api/requests - Create new request
export const handleCreateRequest: RequestHandler = (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '') || 'user_1'; // Mock auth
  
  const newRequest: ServiceRequest = {
    id: `req_${Date.now()}`,
    userId,
    ...req.body,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    proposals: []
  };
  
  requests.push(newRequest);
  
  res.status(201).json(newRequest);
};

// PUT /api/requests/:id - Update request
export const handleUpdateRequest: RequestHandler = (req, res) => {
  const { id } = req.params;
  const userId = req.headers.authorization?.replace('Bearer ', '') || 'user_1'; // Mock auth
  
  const requestIndex = requests.findIndex(r => r.id === id && r.userId === userId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  requests[requestIndex] = {
    ...requests[requestIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json(requests[requestIndex]);
};

// DELETE /api/requests/:id - Cancel request
export const handleDeleteRequest: RequestHandler = (req, res) => {
  const { id } = req.params;
  const userId = req.headers.authorization?.replace('Bearer ', '') || 'user_1'; // Mock auth
  
  const requestIndex = requests.findIndex(r => r.id === id && r.userId === userId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  requests[requestIndex].status = "cancelled";
  requests[requestIndex].updatedAt = new Date().toISOString();
  
  res.json({ message: "Request cancelled successfully" });
};

// POST /api/requests/:id/proposals - Create proposal for request
export const handleCreateProposal: RequestHandler = (req, res) => {
  const { id } = req.params;
  const professionalId = req.headers.authorization?.replace('Bearer ', '') || 'prof_1'; // Mock auth
  
  const request = requests.find(r => r.id === id);
  
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  const newProposal: Proposal = {
    id: `prop_${Date.now()}`,
    professionalId,
    ...req.body,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  
  request.proposals.push(newProposal);
  request.updatedAt = new Date().toISOString();
  
  res.status(201).json(newProposal);
};

// PUT /api/requests/:requestId/proposals/:proposalId - Accept/reject proposal
export const handleUpdateProposal: RequestHandler = (req, res) => {
  const { requestId, proposalId } = req.params;
  const { status } = req.body;
  
  const request = requests.find(r => r.id === requestId);
  
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  const proposal = request.proposals.find(p => p.id === proposalId);
  
  if (!proposal) {
    return res.status(404).json({ error: "Proposal not found" });
  }
  
  proposal.status = status;
  
  if (status === "accepted") {
    request.status = "in_progress";
    // Reject all other proposals
    request.proposals.forEach(p => {
      if (p.id !== proposalId) {
        p.status = "rejected";
      }
    });
  }
  
  request.updatedAt = new Date().toISOString();
  
  res.json(proposal);
};

// GET /api/requests/nearby - Get requests near professional location
export const handleGetNearbyRequests: RequestHandler = (req, res) => {
  const { lat, lng, radius = 10 } = req.query;
  
  // In production, implement proper geospatial queries
  const nearbyRequests = requests.filter(request => 
    request.status === "open" && 
    request.location.coordinates
  );
  
  res.json({
    requests: nearbyRequests,
    total: nearbyRequests.length
  });
};
