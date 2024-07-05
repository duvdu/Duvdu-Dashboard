import { updateFormData } from "../stores/form";
import { useAppDispatch } from "../stores/hooks";

export const useFormInputChange = () => {
  const dispatch = useAppDispatch();
  return (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateFormData({ field, value: event.target.value }));
  };
};