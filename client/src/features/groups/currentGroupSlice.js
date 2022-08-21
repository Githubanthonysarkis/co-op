import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOneGroupHTTP,
  deleteGroupHTTP,
  getTransactionsHTTP,
  addTransactionHTTP,
  deleteTransactionHTTP,
  addMemberHTTP,
  kickMemberHTTP,
  leaveGroupHTTP,
} from "./groupService";
import { getGroups } from "./groupSlice";

export const getOneGroup = createAsyncThunk(
  "groups/get/one",
  async (groupId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      if (token) {
        return {
          current: await getOneGroupHTTP(groupId, token),
          current_transactions: await getTransactionsHTTP(groupId, token),
        };
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/delete/one",
  async (groupId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      if (token) {
        const payload = await deleteGroupHTTP(groupId, token);
        thunkAPI.dispatch(getGroups());
        return payload;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  "groups/transactions/add",
  async ({ groupId, transactionData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      if (token) {
        return await addTransactionHTTP(groupId, transactionData, token);
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "groups/transactions/delete",
  async ({ groupId, transactionId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      if (token) {
        return await deleteTransactionHTTP(groupId, transactionId, token);
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addMember = createAsyncThunk(
  "groups/members/add",
  async ({ groupId, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      if (token) {
        return await addMemberHTTP(groupId, formData, token);
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const kickMember = createAsyncThunk(
  "groups/members/kick",
  async ({ groupId, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      if (token) {
        return await kickMemberHTTP(groupId, data, token);
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const leaveGroup = createAsyncThunk(
  "groups/leave/one",
  async (groupId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      if (token) {
        return await leaveGroupHTTP(groupId, token);
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  group: {},
  transactions: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const currentGroupSlice = createSlice({
  name: "currentGroup",
  initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getOneGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneGroup.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.transactions = payload.current_transactions;
        state.group = payload.current;
      })
      .addCase(getOneGroup.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload;
      })

      .addCase(deleteGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGroup.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.group = {};
        state.transactions = [];
      })
      .addCase(deleteGroup.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload;
      })

      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTransaction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.transactions.push(payload);
      })
      .addCase(addTransaction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload;
      })

      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== payload.id
        );
      })
      .addCase(deleteTransaction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload;
      })

      .addCase(addMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMember.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.group.members.push(payload.username);
      })
      .addCase(addMember.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload;
      })

      .addCase(kickMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(kickMember.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.group.members = state.group.members.filter(
          (member) => member !== payload.username
        );
      })
      .addCase(kickMember.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload;
      })

      .addCase(leaveGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(leaveGroup.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.group.members = state.group.members.filter(
          (member) => member !== payload.username
        );
      })
      .addCase(leaveGroup.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload;
      }),
});

export const { reset } = currentGroupSlice.actions;
export default currentGroupSlice.reducer;
