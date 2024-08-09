import React, { createContext, useReducer, useContext } from "react"
import { initialState, reducer } from "./reducer"

// Create a context for the page state
const PageContext = createContext()

// Context provider component
export const PageContextProvider = ({ children }) => {
  // Initialize the reducer with the initial state
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    // Provide the state and dispatch function to the rest of the app
    <PageContext.Provider value={{ state, dispatch }}>
      {children}
    </PageContext.Provider>
  )
}

// Custom hook to use the page context
export const usePageContext = () => {
  return useContext(PageContext)
}
