import { createSlice } from '@reduxjs/toolkit';


interface NfoState {
    darkMode: string,
}

const initialState: NfoState = {
    darkMode: '',
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateDarkMode: (state, action) => {
            state.darkMode = action.payload.mode;
        },
    }
});

export const { updateDarkMode } = appSlice.actions

export default appSlice.reducer
