import { useUser } from '../../context/UserContext';
import UserEditForm from '../molecules/UserEditForm';
import { UserBalance } from '../atoms/UserBalance';
import '../../styles/profile.css';

export default function UserPanelPage() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-box">
        <UserEditForm />
        <UserBalance />
      </div>
    </div>
  );
}
