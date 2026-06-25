import userReducer, {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  logoutUser,
  setAuthChecked,
  UserState
} from '../user-slice';
import { TUser } from '../../../utils/types';

describe('user slice', () => {
  const initialState: UserState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  };

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  test('should return the initial state', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('should handle setAuthChecked', () => {
    const state = userReducer(initialState, {
      type: setAuthChecked.type
    });
    expect(state).toEqual({
      ...initialState,
      isAuthChecked: true
    });
  });

  test('should handle loginUser.pending', () => {
    const state = userReducer(initialState, {
      type: loginUser.pending.type
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('should handle loginUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      user: mockUser,
      isAuthChecked: true
    });
  });

  test('should handle logoutUser.fulfilled', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser,
      isAuthChecked: true
    };
    const state = userReducer(stateWithUser, {
      type: logoutUser.fulfilled.type
    });
    expect(state).toEqual(initialState);
  });
});
