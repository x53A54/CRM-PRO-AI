// Base API URL
const API = "http://localhost:5000/api";


// LOGIN USER
export const loginUser = async (email: string, password: string) => {

  console.log("Attempting Login:", { email, password });

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  console.log("LOGIN RESPONSE:", data);

  return data;
};


// REGISTER USER
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {

  console.log("Attempting to Register:", { name, email, password, role });

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  console.log("REGISTER RESPONSE:", data);

  return data;
};


// GET LEADS
export const getLeads = async (token: string) => {

  const res = await fetch(`${API}/leads`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
};


// GET TASKS
export const getTasks = async (token: string) => {

  const res = await fetch(`${API}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
};


// GET STATS
export const getStats = async (token: string) => {

  const res = await fetch(`${API}/leads/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
};


// CREATE LEAD
export const createLead = async (token: string, lead: any) => {

  const res = await fetch(`${API}/leads/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(lead)
  });

  return await res.json();
};


// CREATE TASK
export const createTask = async (token: string, task: any) => {

  const res = await fetch(`${API}/tasks/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(task)
  });

  return await res.json();
};

export const deleteLead = async (token: string, id: string) => {

  const res = await fetch(`http://localhost:5000/api/leads/${id}`, {

    method: "DELETE",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }

  });

  return res.json();
};