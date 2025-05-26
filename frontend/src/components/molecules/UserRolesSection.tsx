type Props = {
  roles: string[];
};

export default function UserRolesSection({ roles }: Props) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-dark)]">Roles:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {roles.map((role) => (
          <span
            key={role}
            className="px-2 py-1 text-xs rounded-full bg-[var(--color-primary)] text-white"
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}
