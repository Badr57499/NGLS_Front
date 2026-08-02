import {createContext , useContext , useState , useEffect} from 'react'
import axios from 'axios'
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '')

export default function AuthProvider({children}){
    const [user , setUser] = useState(null)
    const [isloading , setIsloading] = useState(true)
    useEffect(()=>{
        const authCheck = async () => {
        const token =   localStorage.getItem("token")
        if(!token){
            setIsloading(false)
            return
        }
        try{
         const res = await axios.get(`${API_URL}/api/me` , {
            headers : {Authorization:`Bearer ${token}`}
         });
        setUser(res.data.user)

    }catch(err){
        localStorage.removeItem("token");
        setUser(null)
    }finally{
        setIsloading(false)
    }
        }
        authCheck()
    },[])

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null)
    }
   return(
    <AuthContext.Provider value={{user , setUser ,isloading, logout}}>
        {children}
    </AuthContext.Provider>
   )
    

}
export const useAuth = () => useContext(AuthContext)