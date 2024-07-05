import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store'; // Adjust the import to your store file location

interface FormState {
    formData: {
        [key: string]: any;
    };
    errors: { [key: string]: string };
    postSuccess: boolean;
    categories: any[];
}

const initialState: FormState = {
    formData: {},
    errors: {},
    postSuccess: false,
    categories: [],
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        createFormData: (state, action: PayloadAction<{ value: any }>) => {
            state.formData = action.payload.value;
        },
        updateFormData: (state, action: PayloadAction<{ field: string; value: any }>) => {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        insertToArray: (state, action: PayloadAction<{ field: string; value: any }>) => {
            const { field, value } = action.payload;
            const array = state.formData[field] || [];
            state.formData[field] = [...array, value];
        },
        removeItemFromField: (state, action: PayloadAction<{ field: string; index: number }>) => {
            const { field, index } = action.payload;
            const array = state.formData[field];
            if (array) {
                state.formData[field] = array.filter((_: any, idx: number) => idx !== index);
            }
        },
        setErrors: (state, action: PayloadAction<{ [key: string]: string }>) => {
            state.errors = action.payload;
        },
        resetForm: (state) => {
            state.formData = {};
            state.errors = {};
            state.postSuccess = false;
            state.categories = [];
        },
        setPostSuccess: (state, action: PayloadAction<boolean>) => {
            state.postSuccess = action.payload;
        },
    },
});

export const {
    createFormData,
    updateFormData,
    insertToArray,
    removeItemFromField,
    setErrors,
    resetForm,
    setPostSuccess,
} = formSlice.actions;

export const selectFormState = (state: RootState) => state.form.formData;

export default formSlice.reducer;
