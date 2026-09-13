import { useState } from 'react';
import type { FormEvent } from 'react';
import { PET_STATUSES } from '../types/pet';
import type { Pet, PetStatus } from '../types/pet';

interface PetFormProps {
  // null means we are adding a new pet, otherwise we are editing this one.
  initialPet: Pet | null;
  onSave: (pet: Pet) => Promise<void>;
  onCancel: () => void;
}

export default function PetForm({ initialPet, onSave, onCancel }: PetFormProps) {
  const isEditing = initialPet !== null;

  const [id, setId] = useState<string>(initialPet?.id?.toString() ?? '');
  const [name, setName] = useState<string>(initialPet?.name ?? '');
  const [status, setStatus] = useState<PetStatus>(initialPet?.status ?? 'available');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const petId = Number(id);
    if (!Number.isInteger(petId) || petId <= 0) {
      setError('Pet ID must be a positive whole number.');
      return;
    }
    if (!name.trim()) {
      setError('Pet name is required.');
      return;
    }
    if (!status) {
      setError('Please choose a status.');
      return;
    }

    // Build the request body. When editing, keep the pet fields the form
    // does not show (category, photoUrls, tags) so PUT does not erase them.
    const pet: Pet = {
      id: petId,
      name: name.trim(),
      status,
      ...(initialPet
        ? {
            category: initialPet.category,
            photoUrls: initialPet.photoUrls ?? [],
            tags: initialPet.tags ?? [],
          }
        : { photoUrls: [], tags: [] }),
    };

    setSaving(true);
    try {
      await onSave(pet);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(`Save failed: ${message}`);
      setSaving(false);
    }
  }

  return (
    <form className="pet-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Pet' : 'Add Pet'}</h2>

      <label>
        Pet ID
        <input
          type="number"
          min="1"
          step="1"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. 9000000001"
          required
        />
      </label>

      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. doggie"
          required
        />
      </label>

      <label>
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value as PetStatus)}>
          {PET_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error-text">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" className="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
