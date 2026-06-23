import ordersReducer, {
  fetchOrders,
  createOrder,
  fetchOrderByNumber,
  clearCurrentOrder,
  OrdersState
} from '../orders-slice';
import { TOrder } from '../../../utils/types';

describe('orders slice', () => {
  const initialState: OrdersState = {
    orders: [],
    currentOrder: null,
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
    expect(ordersReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('should handle fetchOrders.pending', () => {
    const state = ordersReducer(initialState, {
      type: fetchOrders.pending.type
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('should handle fetchOrders.fulfilled', () => {
    const state = ordersReducer(initialState, {
      type: fetchOrders.fulfilled.type,
      payload: [mockOrder]
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      orders: [mockOrder]
    });
  });

  test('should handle createOrder.pending', () => {
    const state = ordersReducer(initialState, {
      type: createOrder.pending.type
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null,
      currentOrder: null
    });
  });

  test('should handle createOrder.fulfilled', () => {
    const state = ordersReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      currentOrder: mockOrder
    });
  });

  test('should handle clearCurrentOrder', () => {
    const stateWithOrder = {
      ...initialState,
      currentOrder: mockOrder
    };
    const state = ordersReducer(stateWithOrder, {
      type: clearCurrentOrder.type
    });
    expect(state).toEqual(initialState);
  });
});
