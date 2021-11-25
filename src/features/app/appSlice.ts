import { createSlice } from '@reduxjs/toolkit';


interface AppState {
    darkMode: string,
    nfo: number,
}

const initialState: AppState = {
    darkMode: '',
    nfo: 0,
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
        }
    }
});

export const { updateDarkMode, setNfo } = appSlice.actions

export default appSlice.reducer
