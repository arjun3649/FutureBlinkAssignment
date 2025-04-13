import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: () => axios.get('http://localhost:4000/api/auth/me').then((res) => res.data.user),
  });
};
export default useCurrentUser;