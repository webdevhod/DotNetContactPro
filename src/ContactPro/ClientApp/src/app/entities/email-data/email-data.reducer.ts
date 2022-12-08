import axios from "axios";
import {
  createAsyncThunk,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import { cleanEntity } from "app/shared/util/entity-utils";
import {
  IQueryParams,
  createEntitySlice,
  EntityState,
  serializeAxiosError,
} from "app/shared/reducers/reducer.utils";
import { IEmailData, defaultValue } from "app/shared/model/email-data.model";

const initialState: EntityState<IEmailData> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

const apiUrl = "api/contacts";
const apiUrl2 = "api/categories";

// Actions

export const getEntities = createAsyncThunk(
  "emailData/fetch_entity_list",
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`;
    return axios.get<IEmailData[]>(requestUrl);
  }
);

export const getEntity = createAsyncThunk(
  "emailData/fetch_entity",
  async ({ id, isCategory }: IQueryParams) => {
    const requestUrl = `${isCategory ? apiUrl2 : apiUrl}/${id}/email`;
    return axios.get<IEmailData>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  "emailData/create_entity",
  async (entity: IEmailData, thunkAPI) => {
    const result = await axios.post<IEmailData>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  "emailData/update_entity",
  async (entity: IEmailData, thunkAPI) => {
    const result = await axios.put<IEmailData>(
      `${entity.isCategory ? apiUrl2 : apiUrl}/${entity.id}/email`,
      cleanEntity(entity)
    );
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const partialUpdateEntity = createAsyncThunk(
  "emailData/partial_update_entity",
  async (entity: IEmailData, thunkAPI) => {
    const result = await axios.patch<IEmailData>(
      `${apiUrl}/${entity.id}`,
      cleanEntity(entity)
    );
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  "emailData/delete_entity",
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IEmailData>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const EmailDataSlice = createEntitySlice({
  name: "emailData",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, (state) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
        };
      })
      .addMatcher(
        isFulfilled(createEntity, updateEntity, partialUpdateEntity),
        (state, action) => {
          state.updating = false;
          state.loading = false;
          state.updateSuccess = true;
          state.entity = action.payload.data;
        }
      )
      .addMatcher(isPending(getEntities, getEntity), (state) => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(
        isPending(
          createEntity,
          updateEntity,
          partialUpdateEntity,
          deleteEntity
        ),
        (state) => {
          state.errorMessage = null;
          state.updateSuccess = false;
          state.updating = true;
        }
      );
  },
});

export const { reset } = EmailDataSlice.actions;

// Reducer
export default EmailDataSlice.reducer;
