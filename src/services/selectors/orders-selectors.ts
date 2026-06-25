import { RootState } from '../store';

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersIsLoading = (state: RootState) =>
  state.orders.isLoading;
export const selectOrdersError = (state: RootState) => state.orders.error;
