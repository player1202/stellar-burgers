import feedReducer, { fetchFeeds, FeedState } from '../feed-slice';
import { TOrder } from '../../../utils/types';


describe('feed slice', () => {
  const initialState: FeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Тестовый заказ',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['bun-1', 'main-1']
  };

  test('should return the initial state', () => {
    expect(feedReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('should handle fetchFeeds.pending', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.pending.type
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('should handle fetchFeeds.fulfilled', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.fulfilled.type,
      payload: {
        orders: [mockOrder],
        total: 100,
        totalToday: 5
      }
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      orders: [mockOrder],
      total: 100,
      totalToday: 5
    });
  });

  test('should handle fetchFeeds.rejected', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.rejected.type,
      error: { message: 'Ошибка загрузки' }
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
