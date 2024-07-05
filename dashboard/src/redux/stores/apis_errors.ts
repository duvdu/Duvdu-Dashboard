// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store'; // Adjust the import to your store file location

// Define the initial state and slice (example)
const initialState = { error: null };
const ErrorsApiSlice = createSlice({
    name: 'errors',
    initialState,
    reducers: {},
});
interface ErrorState {
    error: any;
  }
  
  function getAllErrors(state: RootState): { error: any; reason: string }[] {
    const errors: { error: any; reason: string }[] = [];
  
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        const subState = state[key] as ErrorState;
        if (subState.error) {
          errors.push({ error: subState.error, reason: key });
        }
      }
    }
  
    return errors;
  }

export const GetAllErrors = (state: RootState) => {
    return getAllErrors(state);
};

export default ErrorsApiSlice.reducer;
