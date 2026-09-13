import type { Pet, PetStatus } from '../types/pet';

const BASE_URL = 'https://petstore.swagger.io/v2';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Turns any fetch Response into the parsed JSON data, or throws a
// readable Error when the server answered with an error status.
async function handleResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const serverMessage = data?.message ?? `Request failed with status ${response.status}`;
    throw new Error(serverMessage);
  }

  return data;
}

// Shared wrapper around the native fetch() API. Every request goes
// through here so components never write fetch() calls themselves.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, options);
  return (await handleResponse(response)) as T;
}

export const petApi = {
  // GET /pet/{petId}
  getPetById(id: number): Promise<Pet> {
    return request<Pet>(`/pet/${id}`);
  },

  // GET /pet/findByStatus?status=available|pending|sold
  getPetsByStatus(status: PetStatus): Promise<Pet[]> {
    return request<Pet[]>(`/pet/findByStatus?status=${status}`);
  },

  // POST /pet
  addPet(pet: Pet): Promise<Pet> {
    return request<Pet>('/pet', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(pet),
    });
  },

  // PUT /pet  (replaces the pet whose id is in the body)
  updatePet(pet: Pet): Promise<Pet> {
    return request<Pet>('/pet', {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(pet),
    });
  },

  // DELETE /pet/{petId}
  deletePet(id: number): Promise<void> {
    return request<void>(`/pet/${id}`, { method: 'DELETE' });
  },
};
