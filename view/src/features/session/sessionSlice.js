import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const receiveCurrent = createAsyncThunk(
    'session/receiveCurrent',
    async() => {
        try{
            const endpoint = `/api/session/`;
            const response = await fetch(endpoint, {
                method: 'GET',
                credentials: 'include'
            });
          
            if(response.ok) {
                const jsonResponse = await response.json(); 
                console.log('account', jsonResponse);           
                return jsonResponse;
            } else{
                console.log('here')
                return null;
            }
        } catch(e) {
            console.error('Error getting session data.');
        }
    }
)

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        user: null,
        role: 'user',
        isLoading: false,
        isFailedLoading: false
    },
    reducers: {
        logOutUser: (state, action) => {
            state.user = null;
            state.role = 'user';
        },
        setUser: (state, action) => {
            state.user = action.payload.id;
            state.role = action.payload.role;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(receiveCurrent.pending, (state) => {
                state.isLoading = true;
                state.isFailedLoading = false;
            })
            .addCase(receiveCurrent.fulfilled, (state, action) => {
                state.user = action.payload.id;
                state.role = action.payload.role;
                state.isLoading = false;
                state.isFailedLoading = false;
            })
            .addCase(receiveCurrent.rejected, (state) => {
                state.isLoading = false;
                state.isFailedLoading = true;
            })
    }
});

export const { logOutUser, setUser } = sessionSlice.actions;
export const selectUser = (state) => state.session.user;
export const selectSession = (state) => state.session;
export const isLoadingUser = (state) => state.session.isLoading;

export default sessionSlice.reducer;