import { useCallback, useEffect, useState } from 'react';
import { PET_STATUSES } from './types/pet';
import type { Pet, PetStatus } from './types/pet';
import { petApi } from './services/petApi';
import PetList from './components/PetList';
import PetForm from './components/PetForm';
import PetDetails from './components/PetDetails';

interface FormState {
  open: boolean;
  pet: Pet | null; // null = adding a new pet
}

interface ViewState {
  loading: boolean;
  error: string | null;
  pet: Pet | null;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong.';
}

export default function App() {
  const [status, setStatus] = useState<PetStatus>('available');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({ open: false, pet: null });
  const [view, setView] = useState<ViewState>({ loading: false, error: null, pet: null });

  // Load the pet list for the currently selected status.
  const loadPets = useCallback(async () => {
    setLoadingPets(true);
    setListError(null);
    try {
      const data = await petApi.getPetsByStatus(status);
      setPets(data);
    } catch (err) {
      setListError(`Could not load pets: ${errorMessage(err)}`);
    } finally {
      setLoadingPets(false);
    }
  }, [status]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  function showMessage(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 5000);
  }

  function openAddForm() {
    setForm({ open: true, pet: null });
  }

  function openEditForm(pet: Pet) {
    setForm({ open: true, pet });
  }

  async function viewPet(pet: Pet) {
    setView({ loading: true, error: null, pet: null });
    try {
      const fullPet = await petApi.getPetById(pet.id as number);
      setView({ loading: false, error: null, pet: fullPet });
    } catch (err) {
      setView({ loading: false, error: `Could not load pet: ${errorMessage(err)}`, pet: null });
    }
  }

  async function handleSave(pet: Pet) {
    if (form.pet) {
      await petApi.updatePet(pet); // PUT
      showMessage('Pet updated.');
    } else {
      await petApi.addPet(pet); // POST
      showMessage('Pet added.');
    }
    setForm({ open: false, pet: null });
    await loadPets();
  }

  async function handleDelete(pet: Pet) {
    const confirmed = window.confirm(`Delete pet "${pet.name}" (ID ${pet.id})?`);
    if (!confirmed) return;

    setDeletingId(pet.id as number);
    try {
      await petApi.deletePet(pet.id as number); // DELETE
      showMessage('Pet deleted.');
      await loadPets();
    } catch (err) {
      setListError(`Delete failed: ${errorMessage(err)}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Pet Management</h1>
        <p className="subtitle">Swagger Petstore API Demo</p>
      </header>

      <main>
        {message && <div className="banner">{message}</div>}

        <section className="toolbar">
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
          <button type="button" onClick={loadPets} disabled={loadingPets}>
            {loadingPets ? 'Loading...' : 'Search / Load'}
          </button>
          <button type="button" className="primary" onClick={openAddForm}>
            Add Pet
          </button>
        </section>

        {listError && <p className="error-text">{listError}</p>}

        <PetList
          pets={pets}
          loading={loadingPets}
          deletingId={deletingId}
          onView={viewPet}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </main>

      {form.open && (
        <div className="modal-backdrop">
          <PetForm
            initialPet={form.pet}
            onSave={handleSave}
            onCancel={() => setForm({ open: false, pet: null })}
          />
        </div>
      )}

      {(view.loading || view.error || view.pet) && (
        <PetDetails
          loading={view.loading}
          error={view.error}
          pet={view.pet}
          onClose={() => setView({ loading: false, error: null, pet: null })}
        />
      )}
    </div>
  );
}
