import type { Pet } from '../types/pet';

interface PetListProps {
  pets: Pet[];
  loading: boolean;
  deletingId: number | null;
  onView: (pet: Pet) => void;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
}

export default function PetList({ pets, loading, deletingId, onView, onEdit, onDelete }: PetListProps) {
  if (loading) {
    return <p className="muted">Loading pets...</p>;
  }

  if (pets.length === 0) {
    return <p className="muted">No pets found for this status.</p>;
  }

  return (
    <table className="pet-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {pets.map((pet) => (
          <tr key={pet.id}>
            <td>{pet.id}</td>
            <td>{pet.name}</td>
            <td>
              <span className={`status-badge status-${pet.status}`}>{pet.status}</span>
            </td>
            <td className="actions-col">
              <button type="button" onClick={() => onView(pet)}>
                View
              </button>
              <button type="button" onClick={() => onEdit(pet)}>
                Edit
              </button>
              <button
                type="button"
                className="danger"
                disabled={deletingId === pet.id}
                onClick={() => onDelete(pet)}
              >
                {deletingId === pet.id ? 'Deleting...' : 'Delete'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
