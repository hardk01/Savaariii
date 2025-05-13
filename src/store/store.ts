import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

export const store = configureStore({
    reducer: rootReducer,
});

// store.subscribe(() => {
//     try {
//       const state = store.getState();
//       localStorage.setItem("formState", JSON.stringify(state.form));
//     } catch (error) {
//       console.error("Failed to save state:", error);
//     }
//   });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;