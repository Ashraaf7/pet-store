import type { Pet } from '../types/pet';

interface PetDetailsProps {
  loading: boolean;
  error: string | null;
  pet: Pet | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function PetDetails({ loading, error, pet, onClose }: PetDetailsProps) {
  let body: JSX.Element;

  if (loading) {
    body = <p>Loading pet details...</p>;
  } else if (error) {
    body = <p className="error-text">{error}</p>;
  } else if (pet) {
    body = (
      <>
        <DetailRow label="ID" value={String(pet.id)} />
        <DetailRow label="Name" value={pet.name} />
        <DetailRow label="Status" value={pet.status ?? '-'} />
        <DetailRow label="Category" value={pet.category?.name ?? '-'} />
        <DetailRow
          label="Photo URLs"
          value={pet.photoUrls && pet.photoUrls.length > 0 ? pet.photoUrls.join(', ') : '-'}
        />
        <DetailRow
          label="Tags"
          value={pet.tags && pet.tags.length > 0 ? pet.tags.map((t) => t.name).join(', ') : '-'}
        />
      </>
    );
  } else {
    body = <p>No pet selected.</p>;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Pet Details</h2>
        <div className="details">{body}</div>
        <div className="form-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
