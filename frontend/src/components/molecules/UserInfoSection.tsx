import UserInfoItem from '../atoms/UserInfoItem';

type Props = {
  name: string;
  email: string;
};

export default function UserInfoSection({ name, email }: Props) {
  return (
    <>
      <UserInfoItem label="Nombre" value={name} />
      <UserInfoItem label="Email" value={email} />
    </>
  );
}
