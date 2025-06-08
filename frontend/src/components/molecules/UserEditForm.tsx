import { useState } from 'react';
import { FiEdit3, FiSave } from 'react-icons/fi';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import UserRolesSection from './UserRolesSection';
import { useTranslation } from 'react-i18next';
import { ZodError } from 'zod';
import { updateUserSchema } from '../../schemas/updateUserSchema';

export default function UserEditForm() {
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const token = localStorage.getItem('token');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<'name' | 'email', string>>
  >({});
  const [notif, setNotif] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleChange =
    (field: 'name' | 'email') => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setErrors({ ...errors, [field]: '' });
    };

  const handleSubmit = async () => {
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    try {
      updateUserSchema.parse(trimmedData);
      setErrors({});

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user?.id}`,
        trimmedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (user?.id) {
        setUser({ ...user, ...trimmedData });
        setFormData(trimmedData);
      }

      setNotif({ message: t('profile.success'), type: 'success' });
      setIsEditing(false);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<'name' | 'email', string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as 'name' | 'email';
          fieldErrors[field] = t(err.message);
        });
        setErrors(fieldErrors);
        return;
      }

      const message =
        error.response?.data?.message || t('profile.errors.unknown');
      setNotif({ message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-semibold text-[var(--color-primary)] tracking-tight">
          {t('profile.title')}
        </h2>
        <button
          onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
          className="p-2 rounded-md cursor-pointer text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition"
          aria-label="Editar perfil"
        >
          {isEditing ? <FiSave size={20} /> : <FiEdit3 size={20} />}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-3 text-[var(--color-dark)]">
          <p className="text-lg break-all">
            <strong>{t('register.name')}:</strong>{' '}
            <span className="font-mono break-all whitespace-pre-wrap block">
              {formData.name}
            </span>
          </p>
          <p className="text-lg break-all">
            <strong>{t('register.email')}:</strong>{' '}
            <span className="font-mono break-all whitespace-pre-wrap block">
              {formData.email}
            </span>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">
              {t('register.name')}
            </label>
            <input
              value={formData.name}
              onChange={handleChange('name')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t('register.email')}
            </label>
            <input
              value={formData.email}
              onChange={handleChange('email')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      )}

      <UserRolesSection roles={user?.roles || []} />

      {notif && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            notif.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{notif.message}</span>
            <button
              onClick={() => setNotif(null)}
              className="font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
