import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="h-full overflow-hidden">
      <Outlet />
    </div>
  );
}
