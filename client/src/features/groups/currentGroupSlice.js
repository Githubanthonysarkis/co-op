import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getOneGroupHTTP, deleteGroupHTTP, getTransactionsHTTP} from "./groupService";

export const getOneGroup = createAsyncThunk(
    'groups/get/one',
    async (groupId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            if (token) {
                return {
                    current: (await getOneGroupHTTP(groupId, token)),
                    current_transactions: (await getTransactionsHTTP(groupId, token))
                }
            }
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'groups/delete/one',
    async (groupId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            if (token) {
                return await deleteGroupHTTP(groupId, token);
            }
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
)


const initialState = {
    group: {},
    transactions: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}

export const currentGroupSlice = createSlice({
    name: 'currentGroup',
    initialState,
    reducers: {
        reset: (state) => {
            state = initialState
        }
    },
    extraReducers: (builder) => 
        builder
            .addCase(getOneGroup.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getOneGroup.fulfilled, (state, {payload}) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.transactions = payload.current_transactions
                state.group = payload.current;
            })
            .addCase(getOneGroup.rejected, (state, {payload}) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = payload;
            })

            .addCase(deleteGroup.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteGroup.fulfilled, (state, {payload}) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.group = {};
                state.transactions = [];
            })
            .addCase(deleteGroup.rejected, (state, {payload}) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = payload;
            })
});

export const {reset} = currentGroupSlice.actions;
export default currentGroupSlice.reducer;