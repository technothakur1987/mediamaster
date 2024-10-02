import { createContext, useCallback, useReducer, useEffect } from "react";
import {reducer} from './reducer'
import { auth } from '../firebase/FirebaseConfig'; // Firebase config and auth import



let AppContext = createContext()

let AppProvider = ({children})=>{
    let initialState  = {
        name:'Vikram bais', 
        age:'35',
        user: null, // Store the authenticated user
        isAuthenticated: false,
        loading: true, // For initial loading state}
        }
    let [state, dispatch] = useReducer(reducer,initialState)

    // Check auth state changes (similar to onAuthStateChanged from Firebase)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // If the user is logged in
        dispatch({ type: 'LOGIN', payload: currentUser });
      } else {
        // If the user is not logged in
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, [dispatch]);
    
    return(<AppContext.Provider value={{...state, dispatch}}>
        {children} </AppContext.Provider>)
    
}

export { AppContext, AppProvider };