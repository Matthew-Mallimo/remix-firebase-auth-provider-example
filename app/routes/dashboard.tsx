import { useLoaderData, json } from 'remix';
import { requireCustomer } from '~/utils/session.server';

export const links = () => {
  return [
    { page: "/auth/login" },
  ];
};

export const loader = ({ request }: { request: Request }) => {
  return requireCustomer(request)((customer: any) => {
    return json({ ...customer });
  });
}

export default () => {
  const data = useLoaderData();

  return (
    <div>
      <h1>Dashboard</h1>
      <form method="post" action="/auth/logout">
        <button>Sign out</button>
      </form>
    </div>
  )
}