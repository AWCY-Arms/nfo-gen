import { createSlice } from '@reduxjs/toolkit';


interface AppState {
    darkMode: string,
    nfo: number,
    lastInput: string,
}

const initialState: AppState = {
    darkMode: '',
    nfo: 0,
    lastInput: '',
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateDarkMode: (state, action) => {
            state.darkMode = action.payload.mode;
        },
        setNfo: (state, action) => {
            state.nfo = action.payload.nfo;
        },
        setLastInput: (state, action) => {
            state.lastInput = action.payload.lastInput;
        }
    }
});

export const { updateDarkMode, setNfo, setLastInput } = appSlice.actions

export default appSlice.reducer
