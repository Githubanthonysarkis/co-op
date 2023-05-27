import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGroupsHTTP, createGroupHTTP } from "./groupService";

const initialState = {
  groups: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const getGroups = createAsyncThunk("groups/get", async (_, thunkAPI) => {
  try {
    // get the token from api, and send it with every request to /groups
    const token = thunkAPI.getState().auth.user?.token;
    if (token) {
      return await getGroupsHTTP(token);
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createGroup = createAsyncThunk(
  "groups/create",
  async (groupData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (token) {
        return await createGroupHTTP(groupData, token);
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

export const groupSlice = createSlice({
  name: "groups",
  initialState,

  reducers: {
    reset: (state) => {
      state = initialState;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(getGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGroups.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.groups = payload || [];
      })
      .addCase(getGroups.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload;
      })

      .addCase(createGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGroup.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.groups = [...state.groups, payload];
      })
      .addCase(createGroup.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload;
      }),
});

export const { reset } = groupSlice.actions;
export default groupSlice.reducer;
