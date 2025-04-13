import axios from 'axios';
import { useMutation,useQueryClient } from '@tanstack/react-query';

export const useApiMutation = ({ url, method = 'post', queryKey }) => {
  
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: (data) =>
      axios({
        method,
        url,
        data,
      }).then((res) => res.data),

    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries(queryKey);
      }
    },
  });
};
