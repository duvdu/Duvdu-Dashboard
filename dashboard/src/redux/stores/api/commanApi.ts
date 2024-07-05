import { PayloadAction } from '@reduxjs/toolkit';
import DataState from '../../moduls';

export function pendingCase(state: DataState) {
    state.loading = true;
    state.data = null;
    state.error = null;
  }
  
  export function fulfilledCase<T>(state: DataState, action: any) {
    state.loading = false;
    state.data = action.payload;
    state.error = null;
  }
  
  export function rejectedCase(state: DataState, action: any) {
    state.loading = false;
    state.data = null;
    state.error = action.error.message;
  }