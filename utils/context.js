import React, { createContext, useReducer, useContext } from "react"
import { initialState, reducer } from "./reducer"

const PageContext = createContext()

export const PageContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <PageContext.Provider value={{ state, dispatch }}>
      {children}
    </PageContext.Provider>
  )
}

export const usePageContext = () => {
  return useContext(PageContext)
}
