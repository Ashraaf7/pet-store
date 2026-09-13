export interface Category {
  id?: number;
  name?: string;
}

export interface Tag {
  id?: number;
  name?: string;
}

export type PetStatus = 'available' | 'pending' | 'sold';

export const PET_STATUSES: PetStatus[] = ['available', 'pending', 'sold'];

// The Pet model matches the Swagger/OpenAPI definition at
// https://petstore.swagger.io/v2/swagger.json (Pet schema).
export interface Pet {
  id?: number;
  category?: Category;
  name: string;
  photoUrls?: string[];
  tags?: Tag[];
  status?: PetStatus;
}
