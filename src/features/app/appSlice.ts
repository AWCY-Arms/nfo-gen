import { createSlice } from '@reduxjs/toolkit';


interface AppState {
    darkMode: string,
    isRightNfo: boolean,
    lastInput: string,
}

const initialState: AppState = {
    darkMode: '',
    isRightNfo: false,
    lastInput: '',
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateDarkMode: (state, action) => {
            state.darkMode = action.payload.mode;
        },
        setIsRightNfo: (state, action) => {
            state.isRightNfo = action.payload.isRightNfo;
        },
        setLastInput: (state, action) => {
            state.lastInput = action.payload.lastInput;
        }
    }
});

export const { updateDarkMode, setIsRightNfo, setLastInput } = appSlice.actions

export default appSlice.reducer
