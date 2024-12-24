import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();
const AppContextProvider = (props)=> {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState (null);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const loadCreditData = async () => {
      try {
        // const {data} =  await axios.get(backendUrl + '/api/user/credits' /*{headers : {token}}*/)
        const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setCredit(data.credits)
          setUser(data.user)
        }
      } catch (error) {
        console.log (error);
        toast.error (error.message)
      }
    }
     const logout = ()=> {
      localStorage.removeItem('token')
      setToken('')
      setUser (null)
     }

     const generateImage = async (prompt) => {
      try {
      const {data} =  await axios.post(backendUrl + '/api/image/generate-image',  {prompt},  { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        loadCreditData()
        return data.resultImage
      } else {
        toast.error (data.message)
      }

      } catch (error) {
        console.log (error)
        toast.error (error.message)
        loadCreditData ()
        if (data.creditBalance === 0) {
           navigate ('/buy')
        }
      }
     }


     useEffect ( ()=> {
      if (token) {
        loadCreditData()
      }
     },[token])

    const value = {
        user,
        setUser,
        showLogin, setShowLogin,
        backendUrl,
        token,setCredit,
        setToken,credit,
        loadCreditData,
        logout,generateImage,
    }
    return (
      <AppContext.Provider value={value}>
           {props.children}
      </AppContext.Provider>
    )
}
export default AppContextProvider